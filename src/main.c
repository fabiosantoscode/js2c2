#include "headers.h"
#include "bindings.h"
#include "utils.h"

void process_object(int argc, char** argv) {
    v7_val_t process = v7_mk_object(v7);

    v7_val_t process_argv = v7_mk_array(v7);

    for (int i = 0; i < argc; i++) {
        v7_array_push(v7, process_argv,
            STRING(argv[i])
        );
    }

    SET(process, "argv", process_argv);

    SET_METHOD(process, "binding", &js_process_binding);

    SET(GLOBAL, "process", process);
}


int main(int argc, char** argv) {
    v7_val_t res;
    v7 = v7_create();
    enum v7_err rcode;

    process_object(argc, argv);

    handle_error(v7_exec_file(
        v7,
        "lib/main.js",
        &res
    ), &res);
}


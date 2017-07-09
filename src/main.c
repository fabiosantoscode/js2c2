#include "headers.h"

enum v7_err js_eval_with_filename(struct v7 *v7, v7_val_t *res) {
    enum v7_err rcode;
    v7_val_t code_arg = v7_arg(v7, 0);
    v7_val_t filename_arg = v7_arg(v7, 1);

    v7_own(v7, &code_arg);
    v7_own(v7, &filename_arg);

    const char* code = v7_get_string(v7, &code_arg, NULL);
    const char* filename = v7_get_string(v7, &filename_arg, NULL);

    v7_set_gc_enabled(v7, 1);

    struct v7_exec_opts opts = {
        filename,
        v7_get_global(v7),
        0
    };

    v7_exec_opt(v7, code, &opts, res);
}

void globals() {
    v7_set_method(v7, v7_get_global(v7), "_evalWithFilename", &js_eval_with_filename);
}

void process_object(int argc, char** argv) {
    v7_val_t process = v7_mk_object(v7);

    v7_val_t process_argv = v7_mk_array(v7);

    for (int i = 0; i < argc; i++) {
        v7_array_push(v7, process_argv,
            STRING(argv[i])
        );
    }

    SET(process, "argv", process_argv);

    SET(v7_get_global(v7), "process", process);
}


int main(int argc, char** argv) {
    v7_val_t res;
    v7 = v7_create();
    enum v7_err rcode;

    globals();

    process_object(argc, argv);

    handle_error(v7_exec_file(
        v7,
        "lib/main.js",
        &res
    ), &res);
}


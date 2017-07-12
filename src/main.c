#include "headers.h"
#include "bindings.h"
#include "utils.h"

JS_FUNCTION(js_eval_with_filename) {
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
        GLOBAL,
        0
    };

    v7_val_t eval_result;
    enum v7_err eval_err = v7_exec_opt(v7, code, &opts, &eval_result);

    v7_disown(v7, &code_arg);
    v7_disown(v7, &filename_arg);

    if (eval_err != V7_OK) {
        return v7_throw(v7, eval_result);
    }

    *res = eval_result;
    return V7_OK;
}

void globals() {
    SET_METHOD(GLOBAL, "_evalWithFilename", &js_eval_with_filename);
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

    SET_METHOD(process, "binding", &js_process_binding);

    SET(GLOBAL, "process", process);
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


#include "headers.h"

JS_FUNCTION(js_print_to_stderr) {
    *res = v7_mk_undefined();
    v7_val_t text_arg = v7_arg(v7, 0);
    if (v7_is_string(text_arg)) {
        size_t len;
        const char* text = v7_get_string(v7, &text_arg, &len);
        write(2, text, len);
        write(2, "\n", 1);
    } else {
        v7_fprintln(stderr, v7, text_arg);
    }
    return V7_OK;
}

JS_FUNCTION(js_buffer_ctor) {
    *res = v7_mk_object(v7);
    v7_val_t path_arg = v7_arg(v7, 0);
    if (v7_is_string(path_arg)) {
        size_t len;
        const char* path = v7_get_string(v7, &path_arg, &len);
        char real_path [2048];
        if (realpath(path, real_path) == 0) {
            const v7_val_t ret = v7_mk_string(v7, real_path, strlen(real_path), 1);
            *res = ret;
        }
    }
    return V7_OK;
}

JS_FUNCTION(js_realpath) {
    *res = v7_mk_undefined();
    v7_val_t path_arg = v7_arg(v7, 0);
    if (v7_is_string(path_arg)) {
        size_t len;
        const char* path = v7_get_string(v7, &path_arg, &len);
        char real_path [2048];
        if (realpath(path, real_path) != 0) {
            const v7_val_t ret = v7_mk_string(v7, real_path, strlen(real_path), 1);
            *res = ret;
        }
    }
    return V7_OK;
}

JS_FUNCTION(js_process_env) {
    *res = v7_mk_array(v7);
    char ** cur = environ;
    while (1) {
        if (!*cur) {
            break;
        }
        v7_array_push(v7, *res, v7_mk_string(v7, *cur, strlen(*cur), 1));
        cur++;
    }
    return V7_OK;
}

JS_FUNCTION(js_process_exit) {
    *res = v7_mk_undefined();
    v7_val_t exit_arg = v7_arg(v7, 0);
    if (v7_is_number(exit_arg)) {
        exit(v7_get_int(v7, exit_arg));
    }
    exit(0);
    return V7_OK;
}

v7_val_t binding_buffer() {
    v7_val_t exports = v7_mk_object(v7);
    v7_val_t buffer_proto = v7_mk_object(v7);
    v7_val_t buffer_constructor = v7_mk_function_with_proto(v7, &js_buffer_ctor, buffer_proto);
    SET(exports, "SlowBuffer", buffer_constructor);
    return exports;
}

JS_FUNCTION(js_process_binding) {
    v7_val_t binding_arg = v7_arg(v7, 0);
    const char* binding = v7_get_string(v7, &binding_arg, 0);

    if (strcmp(binding, "buffer") == 0) {
        *res = binding_buffer();
    } else if (strcmp(binding, "print_to_stderr") == 0) {
        *res = v7_mk_cfunction(&js_print_to_stderr);
    } else if (strcmp(binding, "realpath") == 0) {
        *res = v7_mk_cfunction(&js_realpath);
    } else if (strcmp(binding, "process_env") == 0) {
        *res = v7_mk_cfunction(&js_process_env);
    } else if (strcmp(binding, "process_exit") == 0) {
        *res = v7_mk_cfunction(&js_process_exit);
    } else {
        printf("could not find binding %s\n", binding);
        exit(1);
    }

    return V7_OK;
}


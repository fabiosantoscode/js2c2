#include "headers.h"

int handle_error_reentrant = 0;
void handle_error(enum v7_err rcode, v7_val_t * res) {
    int is_exception = rcode == V7_EXEC_EXCEPTION;
    if (is_exception && !handle_error_reentrant) {
        handle_error_reentrant = 1;
        SET(GLOBAL, "__error", *res);
        handle_error(v7_exec(v7,
            "console.error(__error)", &res), &res);
        handle_error_reentrant = 0;
    } else if (is_exception && handle_error_reentrant) {
        printf("Fatal error. Also, couldn't call console.error");
        if (res != NULL) v7_println(v7, *res);
    } else if (rcode != V7_OK) {
        printf("ERR %d", (int) rcode);
        if (res != NULL) v7_println(v7, *res);
    }
}


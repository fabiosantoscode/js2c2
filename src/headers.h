#pragma once
#include "../v7/v7.h"
#include "string.h"

int TRUE = 1;
int FALSE = 0;
struct v7* v7;

void handle_error(enum v7_err rcode, v7_val_t * res) {
    if (rcode != V7_OK) {
        printf("ERR %d", (int) rcode);
        if (res != NULL) v7_println(v7, *res);
    }
}

#define SET(obj, name, val) v7_set(v7, obj, name, strlen(name), val)
#define STRING(s) v7_mk_string(v7, s, strlen(s), TRUE)

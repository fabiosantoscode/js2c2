#pragma once

#include <unistd.h>
#include <string.h>
#include <stdbool.h>
#include <stdlib.h>
#include <assert.h>

#include "../v7/v7.h"

struct v7* v7;

extern char** environ;

#define GLOBAL v7_get_global(v7)
#define GET(obj, name) v7_get(v7, obj, name, strlen(name))
#define SET(obj, name, val) v7_set(v7, obj, name, strlen(name), val)
#define SET_METHOD(obj, name, meth) v7_set_method(v7, obj, name, meth)
#define STRING(s) v7_mk_string(v7, s, strlen(s), true)
#define JS_FUNCTION(name) enum v7_err name(struct v7 *v7, v7_val_t *res)


#!/bin/bash

set -e

COMPILE=

for f in $(find src)
do
    if [[ "$f" -nt "./js2cpp" ]]; then
        COMPILE=1
    fi
done

if [[ "$COMPILE" = 1 ]]; then
    set -x
    gcc -O0 \
        -o js2cpp \
        -DV7_ENABLE_STACK_TRACKING \
        -DV7_ENABLE_FILE v7/v7.c src/main.c -lm
    set +x
fi

./js2cpp $@


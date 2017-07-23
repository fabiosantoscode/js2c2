
opt='--no-semi --single-quote --trailing-comma es5'

find lib/ | grep \.js$ | xargs prettier --write $opt
find test/ | grep \.js$ | xargs prettier --write $opt

#! /bin/bash
make clean



make
./test_run

/home/fanchenxin/tools/lcov-1.11/bin/lcov -d . -t 'test_run' -o 'test_run.info' -b . -c
#/home/fanchenxin/tools/lcov-1.11/bin/lcov --directory . --output-file test_case.info --test-name  test_case

#../lcov-1.11/bin/genhtml -o . test_case.info
/home/fanchenxin/tools/lcov-1.11/bin/genhtml test_run.info --quiet --output-directory Lcov_out --title "test_run" 

#chmod -R 777 /home/fanchenxin/mytest/

firefox ./Lcov_out/index.html

#--show-details

# --capture --legend

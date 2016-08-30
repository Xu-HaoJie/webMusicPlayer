#! /bin/bash
make clean

if [ $# -ne 1 ]; then
	echo "Usage: ./test_run testfile_dir"
	exit -1;
fi

####### 替换 USER_DIR变量 contents #########
test_dir=$1  #the code you want to test in this direction
n=`grep -n "USER_DIR = " Makefile | awk -F':' '{print $1}'`  #find the line number of 'USER_DIR='
user_dir="USER_DIR = $test_dir"
sed -i "$[ n ]c $user_dir" Makefile  #replace the n(th) line of Makefile to the string $user_dir
####### ending ######################

##########替换UNDER_TEST_INTERFACE_C等三个变量##############
c=".c"
#h=".h"
o=".o"
test_file_name=`find $test_dir -name "*.c" | awk -F'/' '{print $NF}' | awk -F'.' '{print $1}' | sed '/test_case/'d`
test_file_name_c="UNDER_TEST_INTERFACE_C = $test_file_name$c"
#test_file_name_h="UNDER_TEST_INTERFACE_H = $test_file_name$h"
test_file_name_o="UNDER_TEST_INTERFACE_O = $test_file_name$o"

echo $test_file_name

m=`grep -n "UNDER_TEST_INTERFACE_C" Makefile | head -n 1 | awk -F':' '{print $1}'`
echo $m
sed -i "$[ m ]c $test_file_name_c" Makefile
#sed -i "$[ $m+2 ]c $test_file_name_h" Makefile
sed -i "$[ $m+1 ]c $test_file_name_o" Makefile
#################ending###################################

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

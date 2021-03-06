/*
 * grunt-multi-dest
 * https://github.com/ErjanGavalji/grunt-multi-dest
 *
 * Copyright (c) 2014 Erjan Gavalji
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var multiDest = function() {

        var destDirs = [];
        var thisFiles = this.files;
        for(var fileIdx=0; fileIdx<thisFiles.length; fileIdx++)
        {
            destDirs = destDirs.concat(thisFiles[fileIdx].dest);
        }

        var subTasks = this.data.tasks;

        var newTaskList = [];
        var newTaskName = "multidist_runtimecreated_subtask";

        for (var i=0; i<destDirs.length; i++)
        {
            var destDir = destDirs[i];
            for (var k=0; k<subTasks.length; k++)
            {
                var subTask = subTasks[k];

                var subTaskSplit = subTask.split(":");
                var originalSubTaskConfig = grunt.config(subTaskSplit);

                subTaskSplit[1] = this.target + "_" + subTaskSplit[0] + "_" + subTaskSplit[1] + "_subtask_" + k + "_destdir_" + i;

                var newTaskConfig = grunt.util._.clone(originalSubTaskConfig);
                newTaskConfig.dest = destDir;
                grunt.config(subTaskSplit, newTaskConfig);

                newTaskList.push(subTaskSplit.join(":"));
            }
        }

        grunt.registerTask(newTaskName, newTaskList);
        grunt.task.run(newTaskName);

    };

    grunt.registerMultiTask('multidest', 'Run predefined tasks multiple times to copy their output to multiple destinations and avoid duplication', multiDest);
};

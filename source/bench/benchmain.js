/**
@fileOverview
Entry point for the benchmarking code.

@copyright
Copyright (c) 2010 Tachyon Javascript Engine, All Rights Reserved
*/

/**
Parse command-line arguments
*/
function parseArgs()
{
    var args = command_line();

    // Map for named arguments
    var options = {};

    // List for trailing unnamed arguments
    var files = [];

    var argIdx = 0;

    // For each named argument
    for (; argIdx < args.length; argIdx++)
    {
        var arg = args[argIdx];

        // If this is not an option argument, stop
        if (arg.charAt(0) != '-')
            break;

        // Get the option name
        var optName = arg.slice(1);

        // If no option value is present, report an error
        if (argIdx >= args.length - 1)
        {
            error('missing value for command-line option "' + optName + '"');
        }

        // Read the option value
        var optVal = args[argIdx + 1];
        argIdx++;

        // Store the option value
        options[optName] = optVal;
    }

    // For each remaining argument
    for (; argIdx < args.length; ++argIdx)
    {
        // Add it to the file arguments
        files.push(args[argIdx]);
    }

    // Return the parsed arguments
    return {
        "options"   : options,
        "files"     : files
    };
}

/**
Entry point function for the benchmarking code
*/
function main()
{
    // Parse the command-line arguments
    var args = parseArgs();

    // TODO: rename outFile to dataFile
    // TODO: arg to genReport should be report file name

    /*
    for (argName in args.options)
    {
        print('"' + argName + '" = "' + args.options[argName] + '"');
    }
    */

    // If a config file argument is supplied
    if (args.options['cfgFile'])
    {
        bench.loadConfig(args.options['cfgFile']);

        bench.runBenchs();
    }

    // Otherwise, if an output file argument is supplied
    else if (args.options['outFile'])
    {
        bench.loadOutput(args.options['outFile']);

        bench.runBench(
            Number(args.options['platIdx']),
            Number(args.options['benchIdx']),
            Boolean(args.options['testRun'])
        );

        bench.storeOutput(args.options['outFile']);
    }

    // Otherwise, if a report should be generated
    else if (args.options['genReport'])
    {
        bench.loadOutput(args.options['genReport']);

        bench.genReport(args.options['genReport']);
    }
    
    // Otherwise, arguments are missing
    else
    {
        print('expected config file argument');
        return;
    }
}

try 
{
    // Initialize Tachyon
    if (this.initialize)
        initialize();

    main();

    // Uninitialize Tachyon
    if (this.uninitialize)
        uninitialize();
}
catch (e)
{
    if (e.stack)
        print(e.stack);
    else
        print(e);
}


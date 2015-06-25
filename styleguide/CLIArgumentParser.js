
/**
 * Private: Fetches command line arguments from the process
 * 
 * @return {Array} A multidimensional array ([[0:flag, 1: value],[...],...])
 */
function getCommandArguments() {
	var CommandLineArguments = [];
	process.argv.forEach(function (val, index, array) {
		var argument = val.split(/=(.+)/);
		if(argument.length >= 2) {
			CommandLineArguments.push(argument);
		}
	});
	
	return CommandLineArguments;
};

/**
 * Private: Concatenates n-amount of objects
 * @param {Object} [...] Objects that you want to combine
 * @return {Object} Concatenated object
 */
function concatenateObject() {
	var ret = {};
	for (var i = 0; i < arguments.length; i++) {
		for (var prop in arguments[i]) {
			if (arguments[i].hasOwnProperty(prop)) {
				ret[prop] = arguments[i][prop];
			}
		}
	}
	return ret;
};

/**
 * Handles parsing of CLI arguments
 */
var CLIArgumentParser = function() {
	this.arguments = [];
};

/**
 * Register an argument
 * @param {Array} argumentKeys The flags from the CLI, e.g. ['-h','--help']
 * @param {String} mappedKey The internal key for the flags, e.g. 'help'
 */
CLIArgumentParser.prototype.registerArgument = function(argumentKeys, mappedKey) {
	this.arguments.push({
		mappedKey: mappedKey,
		argumentKeys: argumentKeys
	});
};

/**
 * Get the registered mapped key for a CLI argument
 * @param {String} argKey The argument key/flag, e.g. '--help'
 * @return {Mixed} The mapped key ('help') or false if no matches
 */
CLIArgumentParser.prototype.getRegisteredMappedKey = function(argKey) {
	var returnKey = false;
	for(var i = 0; i < this.arguments.length; i++) {
		if(this.arguments[i].argumentKeys.indexOf(argKey) !== -1) {
			returnKey = this.arguments[i].mappedKey;
			break;
		}
	}
	
	return returnKey;
};

/**
 * Get all mapped CLI flags
 * @return {Object} An object with all mapped keys and their values ({'help':'someValue',...})
 */
CLIArgumentParser.prototype.getMappings = function() {
	var args = getCommandArguments();
	var cliargs = [];
	for(var i = 0; i < args.length; i++) {
		var argkey = args[i][0];
		var val = args[i][1];
		
		var registeredMappedKey = this.getRegisteredMappedKey(argkey);
		
		if(registeredMappedKey) {
			var obj = {};
			obj[registeredMappedKey] = val;
			cliargs.push(obj);
		}
	}
	
	return concatenateObject.apply(null, cliargs);
};

/**
 * If the process has received any valid flags
 * @return {Bool} True if any valid mapped key was found
 */
CLIArgumentParser.prototype.hasCLIArguments = function() {
	var args = this.getMappings();
	for(var n in args) {
		if(args.hasOwnProperty(n)) {
			return true;
		}
	}
	
	return false;
}

module.exports = CLIArgumentParser;
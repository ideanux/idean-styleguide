var fs = require("fs");
var CLIArgumentParser = require("./CLIArgumentParser.js");
var Validator = require("./Validator.js");

/**
 * Module for external configuration file
 * @param {String} configfile Path to the config file
 */
function Configurator(configfile) {
	//Compiler default variables
	this.configfile = configfile;
	this.templatePath = "templates/";
	this.styleguideTitle = 'Idean Style Guide';
	this.compiledCssPath = "../css/style.css";
	this.uncompiledCssPath = "../css/";
	this.output = "styleguide.html";
	this.cssCompiler = "less";
	this.CLIParser = new CLIArgumentParser();
	this.registerCLIBindings();
	
	this.hasConfig = fs.existsSync(this.configfile);
	
	if(this.hasConfig) {
		this.loadConfiguration(this.loadConfigurationFromDisk());
	}
	if(this.CLIParser.hasCLIArguments()){
		this.hasConfig = true;
		this.loadConfiguration(this.CLIParser.getMappings());
	}
};

/**
 * Load external config file from disk and return as object
 * 
 * @return {Object} The config object
 */
Configurator.prototype.loadConfigurationFromDisk = function() {
	return JSON.parse(fs.readFileSync(this.configfile));
};

/**
 * Validates a configuration object. Throws errors to console
 * 
 * @param {Object} Optional: a configuration object, if none is provided, existing is used
 * @return {Bool} True if valid
 */
Configurator.prototype.validateConfiguration = function(config) {
	config = config || this.getConfiguration();
	var errors = [];
	for(var i in config) {
		if(config.hasOwnProperty(i)) {
			if(!Validator.validate(i, config[i])) {
				errors.push('Invalid value (' + config[i] + ') for ' + i);
			}
		}
	}
	if(errors.length != 0) {
		for(var i = 0; i < errors.length; i++) {
			console.log(errors[i]);
		}
		
		return false;
	}
	
	return true;
}

/**
 * Registers CLI argument bindings to the configuration
 */
Configurator.prototype.registerCLIBindings = function() {
	this.CLIParser.registerArgument(['--template-path', '-tp'], 'templatePath');
	this.CLIParser.registerArgument(['--compiled-css-path', '-cp'], 'compiledCssPath');
	this.CLIParser.registerArgument(['--uncompiled-css-path', '-up'], 'uncompiledCssPath');
	this.CLIParser.registerArgument(['--output', '-o'], 'output');
	this.CLIParser.registerArgument(['--css-compiler', '-cc'], 'cssCompiler');
	this.CLIParser.registerArgument(['--title', '-t'], 'styleguideTitle');
}

/**
 * Load external config file and populate defaults
 */
Configurator.prototype.loadConfiguration = function(myConfig) {
	if(myConfig.compiledCssPath) {
		this.compiledCssPath = myConfig.compiledCssPath;
	}
	if(myConfig.uncompiledCssPath) {
		this.uncompiledCssPath = myConfig.uncompiledCssPath;
	}
	if(myConfig.output) {
		this.output = myConfig.output;
	}
	if(myConfig.cssCompiler) {
		this.cssCompiler = myConfig.cssCompiler;
	}
	if(myConfig.templatePath) {
		this.templatePath = myConfig.templatePath;
	}
	if(myConfig.styleguideTitle) {
		this.styleguideTitle = myConfig.styleguideTitle;
	}
};

/**
 * Return the current configuration settings as an object
 * @return {Object} Configuration object
 */
Configurator.prototype.getConfiguration = function() {
	return {
		templatePath: this.templatePath,
		compiledCssPath: this.compiledCssPath,
		uncompiledCssPath: this.uncompiledCssPath,
		output: this.output,
		cssCompiler: this.cssCompiler,
		styleguideTitle: this.styleguideTitle
	}	
};

/**
 * Save the data to an external file for future use
 * @param  {function} onSuccess Function to run on successful configuration
 */
Configurator.prototype.completeInput = function(onSuccess) {
	process.stdin.pause();

	var writeData = JSON.stringify(this.getConfiguration());

	fs.writeFile(
		this.configfile,
		writeData,
		function (err) {
			if (err) {
				console.log('There has been an error saving your configuration data.');
				console.log(err.message);
				return false;
			}
			
			console.log("Config Saved");
			
			if(typeof onSuccess === 'function') {
				onSuccess();
			}
			
			return true;
		}
	);
};

/**
 * Start up the configuration process, prompt the user for needed settings.
 * @param  {function} onSuccess Function to run on successful configuration
 */
Configurator.prototype.configurate = function(onSuccess) {
	var step = 0;
	var steps = [
		"Path to the compiled CSS file", 
		"Path to root folder of uncompiled CSS", 
		"output file name", 
		"css compiler: less, sass or stylus", 
		"Path to templates",
		"Title of the style guide"
	];
	var stepVal = [
		this.compiledCssPath, 
		this.uncompiledCssPath, 
		this.output, 
		this.cssCompiler, 
		this.templatePath,
		this.styleguideTitle
	];
	
	console.log(steps[0]+" Default:"+stepVal[step]);
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	
	process.stdin.on(
		'data', 
		function (text) {
			var pass = false;
			text = text.replace("\r\n", "").replace("\n","").trim();
			switch(step){
				case 0: 
					if(text === '') {
						text = this.compiledCssPath;
					}
					if(Validator.validate('compiledCssPath', text)) {
						console.log("Compiled CSS file set to: " + text);
						this.compiledCssPath = text;
						pass = true;
					}
				break;
				case 1: 
					if(text === '') {
						text = this.uncompiledCssPath;
					}
					if(Validator.validate('uncompiledCssPath', text)) {
						console.log("Uncompiled folder set to: " + text);
						this.uncompiledCssPath = text;
						pass = true;
					}
				break;
				case 2: 
					if(text === '') {
						text = this.output;
					}
					if(Validator.validate('output', text)) {
						console.log("Output file set to: " + text);
						this.output = text;
						pass = true;
					}
				break;
				case 3: 
					if(text === '') {
						text = this.cssCompiler;
					}
					if(Validator.validate('cssCompiler', text)) {
						console.log("Compiler set to: " + text);
						this.cssCompiler = text;
						pass = true;
					}
				break;
				case 4: 
					if(text === '') {
						text = this.templatePath;
					}
					if(Validator.validate('templatePath', text)) {
						console.log("Template path set to: " + text);
						this.templatePath = text;
						pass = true;
					}
				break;
				case 5: 
					if(text === '') {
						text = this.styleguideTitle;
					}
					if(Validator.validate('styleguideTitle', text)) {
						console.log("Styleguide title set to: " + text);
						this.styleguideTitle = text;
						pass = true;
					}
				break;
				default: 
					pass = false; 
				break;
			}
			
			if(pass) {
				step ++;
				if(step >= steps.length){
					this.completeInput(onSuccess);
				} else {
					console.log(steps[step]+" Default: "+stepVal[step]);
				}
			}
		}.bind(this)
	);
};

module.exports = Configurator;
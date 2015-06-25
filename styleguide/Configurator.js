var fs = require("fs");

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
	
	this.hasConfig = fs.existsSync(this.configfile);
	
	if(this.hasConfig) {
		this.loadConfiguration();
	}
};

/**
 * Load external config file and populate defaults
 */
Configurator.prototype.loadConfiguration = function() {
	var readData = fs.readFileSync(this.configfile);
	var myConfig = JSON.parse(readData);
	
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
			if(typeof onSuccess === 'function') {
				onSuccess();
			}
			console.log("Config Saved");
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
var fs = require("fs");

var Validator = {

	validate: function(configKey, configValue) {
		var pass = false;
		switch(configKey) {
			case 'compiledCssPath':
				pass = this.validateCompiledCssPath(configValue);
			break;
			case 'uncompiledCssPath':
				pass = this.validateUncompiledCssPath(configValue);
			break;
			case 'output':
				pass = this.validateOutput(configValue);
			break;
			case 'cssCompiler':
				pass = this.validateCssCompiler(configValue);
			break;
			case 'templatePath':
				pass = this.validateTemplatePath(configValue);
			break;
			case 'styleguideTitle':
				pass = this.validateStyleguideTitle(configValue);
			break;
		}
		
		return pass;
	},
	
	
	/**
	 * Check if the path has .css otherwise append and save to local value
	 * @param  {String} text Path to compiled CSS
	 * @return {Bool}        test passed
	 */
	validateCompiledCssPath: function(text) {
		var pass = false;
		
		if(text.length > 0) {
			if(text.indexOf(".css", text.length - 4) !== -1){
				pass = true;
			}
		}
		
		return pass;
	},
	
	/**
	 * Validate file path and save to local value
	 * @param  {String} text Path to root uncompiled CSS folder
	 * @return {Bool}        test passed
	 */
	validateUncompiledCssPath: function(text) {
		var pass = false;
		
		if(text.length > 0) {
			if(text.indexOf("/", text.length - 1) !== -1) {
				pass = true;
			}
		}
		
		return pass;
	},
	
	/**
	 * Check if the path has .html otherwise append and save to local value
	 * @param  {String} text Path to file to output
	 * @return {Bool}        test passed
	 */
	validateOutput: function(text) {
		var pass = false;
		
		if(text.length > 0) {
			if(text.indexOf(".html", text.length - 5) !== -1) {
				pass = true;
			}
		}
		
		return pass;
	},
	
	/**
	 * Check if the css compiler is valid and save to local value
	 * @param  {String} text Css compiler
	 * @return {Bool}        test passed
	 */
	validateCssCompiler: function(text) {
		var pass = false;
		
		if(text.length > 0) {
			if(text.toLowerCase() === "less") {
				pass = true
			} else if(text.toLowerCase() === "sass") {
				pass = true
			} else if(text.toLowerCase() === "stylus") {
				pass = true
			} else {
				console.log("Unsupported compiler, we only support less, sass or stylus!");
			}
		}
		
		return pass;
	},
	
	/**
	 * Validates the path to the templates.
	 * @param  {String} text Template path
	 * @return {Bool}        test passed
	 */
	validateTemplatePath: function(text) {
		var pass = false;
		var createDirectory = false;
		
		if(!text) {
			text = this.templatePath;
		}
		
		try {
			var stats = fs.lstatSync(text);
			if (stats.isDirectory()) {
				pass = true;
			}
		} catch (e) {
			createDirectory = true;
		}
		
		if(createDirectory){
			try {
				fs.mkdirSync(text);
				pass = true;
			} catch(e) {
				throw e;
			}	
		}
		
		return pass;
	},
	
	/**
	 * Validates the style guide title.
	 * @param  {String} text The style guide title
	 * @return {Bool}        test passed
	 */
	validateStyleguideTitle: function(text) {
		var pass = false;
	
		if(text) {
			pass = true;
		}
		
		return pass;
	}
	
};
module.exports = Validator;
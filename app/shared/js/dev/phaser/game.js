"use strict";
/**
* Game class
*
* @class Game
* @namespace LR
*/
LR.Game = function(_containerId, _width, _height, _scaleMode, _debug) {
	/**
	* The Input Manager of LadybugRiders Engine
	* 
	* @property inputManager
	* @type {Phaser.Plugin.InputManager}
	*/
	this.inputManager = null;

	/**
	* The PlayerSave of LadybugRiders Engine
	* 
	* @property playerSave
	* @type {Phaser.Plugin.PlayerSave}
	*/
	this.playerSave = null;

	/**
	* The CollisionManager of LadybugRiders Engine
	* 
	* @property collisionManager
	* @type {CollisionManager}
	*/
	this.collisionManager = null;

	this.scaleMode = _scaleMode;
	this.debug = _debug;

	var renderType = Phaser.AUTO;

	var appVersion = window.navigator.appVersion.toLowerCase();
	if( appVersion.indexOf("android") >= 0 || appVersion.indexOf("ios") >= 0)
		renderType = Phaser.CANVAS;

	if (_width && _height) {
		Phaser.Game.call(this, _width, _height,
					 renderType, _containerId, this);
	} else {
		Phaser.Game.call(this, 640, 360,
					 renderType, _containerId, this);
	}
}

LR.Game.prototype = Object.create(Phaser.Game.prototype);
LR.Game.prototype.constructor = LR.Game;

LR.Game.prototype.preload = function() {
	this.scale.scaleMode = this.scaleMode;
	this.scale.pageAlignVertically = true;
	this.scale.pageAlignHorizontally = true;

	// load layers from json file
	this.game.load.json("layersData", "assets/physics/layers.json", true);
	// load inputs from json file
	this.game.load.json("inputsData", "assets/inputs/inputs.json", true);
	//load save
	this.game.load.json("saveData", "assets/save/playersave.json", true);
};

LR.Game.prototype.create = function() {
	if (this.debug)
		this.game.add.plugin(Phaser.Plugin.Debug);
	this.game.plugins.add(Phaser.Plugin.PlayerSave);
	this.game.plugins.add(Phaser.Plugin.InputManager);
	this.game.plugins.add(Phaser.Plugin.CutsceneManager);
	this.game.plugins.add(Phaser.Plugin.DialogManager);

	//Scale
	if(this.scaleMode != null){
		this.game.scale.scaleMode = this.scaleMode;
		this.game.scale.setMinMax(0,0,2000,2000);
		this.game.scale.refresh();
	}

	var stateBoot = new LR.State.StateBoot(this);
	var stateLoader = new LR.State.StateLoader(this);
	var stateLevel = new LR.State.StateLevel(this);

	//COCOON JS needs JSON parser		
	if( this.game.device.cocoonJS == true){
		 window.DOMParser = DOMishParser;
	}

	this.state.start("Boot");
};

////////////
// STATIC //
////////////

LR.Game.GetUrlParamValue = function(_param) {
	var value = null;

	var href = window.location.href.split("?");
	if (href.length > 1) {
		var search = href[1];
		var params = search.split("?");
		if (params.length > 0) {
			params = params[0].split("&");

			var found = false;
			var i = 0;
			while (i < params.length && found == false) {
				var pair = params[i].split("=");
				if (pair[0] == _param) {
					value = pair[1];
					found = true;
				}

				i++;
			}
		}
	}

	return value;
}


#pragma strict

var eternity_piece_texture: Texture;
var time_texture: 			Texture;
var pink_potion_texture: 	Texture;
var mouse_texture: 			Texture;
var silver_potion_texture:  Texture;
var gold_potion_texture:	Texture;
var no_potion_texture:		Texture;
var potion_background:		Texture;
var label_style: 			GUIStyle = GUIStyle();
var eternity_quantity: 		int = 0;
var remaining_time:  		uint = 300;
var display_icone_mouse:	boolean = false;

// Potions Stuff
var current_potion: 		Potion = Potion.NoPotion;
var potion_in_use:			Potion = Potion.NoPotion;

function Start () {

}

function Update () {

}

function OnGUI () {
	if (Application.loadedLevelName == "boss_level") {
		GUI.Label (Rect (20, 20, 100, 50), eternity_piece_texture);
		GUI.Label (Rect (70, 32, 100, 50), "" + eternity_quantity, label_style);
	} else {
		// Display Time + eternity
		GUI.Label (Rect (10, 8, 100, 50), eternity_piece_texture);
		GUI.Label (Rect (70, 18, 100, 50), "" + eternity_quantity, label_style);
		GUI.Label (Rect (10, 63, 100, 50), time_texture);
		GUI.Label (Rect (70, 73, 100, 50), "" + remaining_time + " sec", label_style);

		// Display Current Potion
		GUI.Label (Rect (Screen.width - 80, 15, 70, 70), potion_background);
		switch (current_potion) {
			case Potion.NoPotion: GUI.Label (Rect (Screen.width - 133, -11, 150, 200), no_potion_texture); break;
			case Potion.PinkPotion: GUI.Label (Rect (Screen.width - 133, -11, 150, 200), pink_potion_texture); break;
			case Potion.SilverPotion: GUI.Label (Rect (Screen.width - 133, -11, 150, 200), silver_potion_texture); break;
			case Potion.GoldPotion: GUI.Label (Rect (Screen.width - 133, -11, 150, 200), gold_potion_texture); break;
		}
		switch (potion_in_use) {
			case Potion.NoPotion: break;
			case Potion.PinkPotion: GUI.Label (Rect (Screen.width / 2 - 133, 0, 150, 200), "Bonus Vitesse +", label_style); break;
			case Potion.SilverPotion: GUI.Label (Rect (Screen.width / 2- 163, 0, 150, 200), "Bonus Dommages X 2", label_style); break;
			case Potion.GoldPotion: GUI.Label (Rect (Screen.width / 2 - 138, 0, 150, 200), "Bonus Cristaux X 2", label_style); break;
		}
	}
	if (display_icone_mouse) {
		GUI.Label(Rect(Screen.width - 60, Screen.height - 60, 50, 50), mouse_texture);
	}
}

function AddEternity(quantity: int) {
	eternity_quantity += quantity;
}

function UpdateTime(quantity: int) {
	if (quantity > 0) { 
		remaining_time = quantity;
	} else {
		remaining_time = 0;
	}
}

function UpdateCurrentPotion(NewPotion: Potion) {
	current_potion = NewPotion;
}

function UsePotion(NewPotion: Potion) {
	potion_in_use = NewPotion;
}

function DisplayIconeCamera() {
	if (display_icone_mouse == true) {
		display_icone_mouse = false;
	} else {
		display_icone_mouse = true;
	}
}
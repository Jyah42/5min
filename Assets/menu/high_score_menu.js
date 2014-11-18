//#pragma strict

import System.IO;

//var file_path = "/Users/jeremy/Documents/laval/work/video_game/5min_menus/test_file.txt";
var file_path = "./high_score.txt";
var file_content: 		Array = new Array();
var label_style: 		GUIStyle = GUIStyle();
var label_style_name:	GUIStyle = GUIStyle();
var label_style_score:	GUIStyle = GUIStyle();
var label_style_button:	GUIStyle = GUIStyle();
var custom_skin: 		GUISkin;

function Start () {
	Destroy(GameObject.Find("ScoreSaver"));
	ReadFile();
}

function Update () {

}

function OnGUI() {

	GUI.Label(Rect(Screen.width / 2 - 90, Screen.height / 2 - 200, 200, 200), "Scores", label_style);
	
	var lag: int = 100;
	var it: int = 0;
	while (it < file_content.length) {
		GUI.Label(Rect(Screen.width / 2 - 170, Screen.height / 2 - lag, 200, 200),file_content[it][0], label_style_name);
		GUI.Label(Rect(Screen.width / 2 + 120, Screen.height / 2 - lag, 200, 200),file_content[it][1], label_style_score);
		lag -= 30;
		it += 1;
	}
	
	GUI.skin = custom_skin;
	if (GUI.Button(Rect(10, Screen.height - 40, 180, 30), "Retour")) {
		Application.LoadLevel("main_menu");
	}
}

function AddHiScore(player_name: String, score: String) {
	file_content[file_content.length] = [player_name, score];
}

function SaveHighScore() {
	WriteFile();
}

function ReadFile() {
	var sr: StreamReader = new File.OpenText(file_path);

	var input: String = "";
	var it: int = 0;
	while (true) {
    	input = sr.ReadLine();
		if (input == null) { break; }
		file_content[it] = input.Split(" "[0]);
		it += 1;
	}
	sr.Close();
}

function WriteFile() {
    var sw: StreamWriter = new StreamWriter(file_path);
    
    var it: int = 0;
    while (it < file_content.length) {
    	sw.WriteLine(file_content[it][0] + " " + file_content[it][1]);
    	sw.Flush();
	}
        
    sw.Close();
}
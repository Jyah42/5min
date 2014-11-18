//#pragma strict

var label_style:   			GUIStyle = GUIStyle();
var label_style2:   		GUIStyle = GUIStyle();
var custom_skin: 			GUISkin;

var file_path: String;
var file_content: 		Array = new Array();

private var score: 			int = 0;
private var player_name: 	String = "";
private var on_boss: 		boolean = true;

function Start () {
	DontDestroyOnLoad(gameObject);
	ReadFile();
}

function Update () {

}

function OnGUI() {
	if (!on_boss) {
		GUI.Label(Rect(Screen.width / 2 - 260, Screen.height / 2 - 200, 200, 200), "Sauvegarde du score: " + score, label_style);
		
		// Textfield
		GUI.Label(Rect(Screen.width / 2 - 160, Screen.height / 2 - 50, 200, 200), "Nom du joueur: ", label_style2);
		GUI.skin = custom_skin;
		player_name = GUI.TextField (Rect (Screen.width / 2 + 90, Screen.height / 2 - 53, 80, 30), player_name, 25);
		if (player_name.Length > 4) {
			player_name = player_name.Substring(0, 4);
		}
		// Save
		if (GUI.Button(Rect(10, Screen.height - 40, 180, 30), "Sauvergarder")) {
			if (player_name.Length == 0) {
				player_name = "AAAA";
			}
			AddHiScore(player_name, "" + score);
			SortScores();
			SaveHighScore();
			Application.LoadLevel("high_score");
		}
		if (GUI.Button(Rect(Screen.width - 190, Screen.height - 40, 180, 30), "Menu principal")) {
			Application.LoadLevel("main_menu");
		}
	}
}

function SetScoreFromBoss(score_to_save: int) {
	on_boss = false;
	score = score_to_save;
}

function AddHiScore(player_name: String, score: String) {
	if (file_content.length == 5) {
		var last_score: int = parseInt(file_content[file_content.length - 1][1]);
		if (last_score < parseInt(score)) {
			file_content[file_content.length - 1][0] = player_name;
			file_content[file_content.length - 1][1] = score;
		}
	} else {
		file_content[file_content.length] = [player_name, score];
	}
}

function SaveHighScore() {
	WriteFile();
}

function SortScores() {
	var it: int = 0;
	var internal_it: int = 0;
	var tmp_tab: Array = new Array();
	
	while (it < file_content.length) {
		internal_it = 0;
		while (internal_it < file_content.length - 1) {
			if (parseInt(file_content[internal_it][1]) < parseInt(file_content[internal_it + 1][1])) {
				tmp_tab[0] = file_content[internal_it][0];
				tmp_tab[1] = file_content[internal_it][1];
				file_content[internal_it][0] = file_content[internal_it + 1][0]; 
				file_content[internal_it][1] = file_content[internal_it + 1][1];
				file_content[internal_it + 1][0] = tmp_tab[0];
				file_content[internal_it + 1][1] = tmp_tab[1];
			}
			internal_it += 1;
		}
		it += 1;
	}
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
    	it += 1;
	}
        
    sw.Close();
}
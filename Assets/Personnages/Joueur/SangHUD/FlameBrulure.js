#pragma strict

var LifeTime : float;

function Awake()
{
	var tache : GUITexture = GetComponent(GUITexture);
	tache.pixelInset.x = Screen.width / 2;
	tache.pixelInset.y = Screen.height / 2;
	
	Destroy (gameObject, LifeTime);
	
}
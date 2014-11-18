#pragma strict

var LifeTime : float = 1.5;

function Awake()
{
	var tache : GUITexture = GetComponent(GUITexture);
	tache.pixelInset.x += 50 * Random.Range(-5, 5);
	tache.pixelInset.y += 25 * Random.Range(-5, 5);
	
	Destroy (gameObject, LifeTime);
	
}
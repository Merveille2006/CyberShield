<?php

header("Content-Type: application/json; charset=UTF-8");


$action = $_SERVER['REQUEST_METHOD'];


if ($action === 'GET') {

    $liste_dossiers = [
        ["id" => 1, "type" => "Arnaque Mobile Money", "statut" => "En cours"],
        ["id" => 2, "type" => "Phishing Facebook", "statut" => "Nouveau"]
    ];
    

    echo json_encode($liste_dossiers);
}

elseif ($action === 'POST') {
    
    $reponse = [
        "statut" => "succes",
        "message" => "Votre signalement a bien ete recu par la brigade."
    ];
    
    echo json_encode($reponse);
}

else {

    echo json_encode([
        "statut" => "erreur",
        "message" => "Action non autorisée sur l'API."
    ]);
}
?>
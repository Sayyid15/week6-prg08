import { DecisionTree } from "/libraries/decisiontree.js"
import { VegaTree } from "/libraries/vegatree.js"

//
// DATA
//
// const csvFile = "/data/mushrooms.csv"
const trainingLabel = "class"
const ignored = ["class"]

let actualFinaWorldChampionships = 0;
let actualOlympicGames = 0;
let predictedFinaWorldChampionships = 0;
let predictedOlympicGames = 0;

//
// laad csv data als json
//
function loadData() {
    Papa.parse("/data/Swimming database 2.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5));

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: data,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    let json = decisionTree.toJSON()
    let jsonString = JSON.stringify(json)
    console.log(jsonString)

    // todo : maak een prediction met een sample uit de testdata
    let swimmer = testData[0]
    let swimmerPrediction = decisionTree.predict(swimmer)
    console.log(`Swam at FINA World Championships or Olympic Games : ${swimmerPrediction}`)

    // todo : bereken de accuracy met behulp van alle test data
    function accuracy(data, tree, label){
        let correct = 0;
        for(let row of data){
            if (row.class === tree.predict(row)){
                correct++
            }
        }

        console.log(`Accuracy ${label} data: ${correct / data.length}`)

        let accuracyValue = document.getElementById('accuracy');
        accuracyValue.innerText = `Accuracy: ${correct / data.length}`;
    }

    accuracy(trainData, decisionTree, "train");
    accuracy(testData, decisionTree, "test");

    for(const row of data){
        if(row.class === "e" && decisionTree.predict(row) === "e") {
            actualFinaWorldChampionships++
        }
        else if (row.class === "e" && decisionTree.predict(row) === "p") {
            predictedOlympicGames++
        }
        else if (row.class === "p" && decisionTree.predict(row) === "e"){
            predictedFinaWorldChampionships++
        }
        else if (row.class === "p" && decisionTree.predict(row) === "p"){
            actualOlympicGames++
        }
    }

    let FinaWorldChampionshipsActual = document.getElementById('actualFinaWorldChampionships');
    FinaWorldChampionshipsActual.innerText = actualFinaWorldChampionships.toString();

    let OlympicGamesPredicted = document.getElementById('predictedOlympicGames');
    OlympicGamesPredicted.innerText = predictedOlympicGames.toString();

    let FinaWorldChampionshipsPredicted = document.getElementById('predictedFinaWorldChampionships');
    FinaWorldChampionshipsPredicted.innerText = predictedFinaWorldChampionships.toString();

    let OlympicGamesActual = document.getElementById('actualOlympicGames');
    OlympicGamesActual.innerText = actualOlympicGames.toString();

}



loadData()












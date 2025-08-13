const facts = [
        "The first car was invented in 1886 by Karl Benz.",
        "There are over 1.4 billion cars in the world today.",
        "The average car has about 30,000 parts.",
        "The world’s fastest street-legal car is the Bugatti Chiron Super Sport 300+.",
        "Electric cars were invented before gasoline cars.",
        "The most produced car model is the Toyota Corolla.",
        "The longest car ever built was over 100 feet long.",
        "The largest speeding fine ever given was $1,000,000.",
        "The first speeding ticket was issued in 1902.",
        "Windshield wipers were invented by a woman, Mary Anderson."
    ];
document.getElementById('random-fact-btn').addEventListener('click', function() {
    const idx = Math.floor(Math.random() * facts.length);
    const factDiv = document.getElementById('random-fact');
    factDiv.textContent = facts[idx];
    factDiv.style.display = 'block';
});
document.getElementById('img6').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'block';
});
document.getElementById('img8').addEventListener('click', function (event) {
    event.preventDefault();
    closePopup();
});

document.getElementById('img9').addEventListener('click', function (event) {
    event.preventDefault();
    closePopup();
    window.close();
});

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}


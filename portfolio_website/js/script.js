const hamburger = document.querySelector('.hamburger'),
	menu = document.querySelector('.menu'),
	closeElem = document.querySelector('.menu__close');

hamburger.addEventListener('click', () => {
	menu.classList.add('active');
});

closeElem.addEventListener('click', () => {
	menu.classList.remove('active');
});

document.querySelectorAll('.portfolio__scale').forEach(item => {
	item.addEventListener('click', (event) => {
		let overlay = item.querySelector('.portfolio__text');
		let isActive = overlay.classList.contains('active');
		let link = item.querySelector('.portfolio__link').href; 

		
		event.preventDefault();

		
		document.querySelectorAll('.portfolio__text').forEach(text => text.classList.remove('active'));

		if (!isActive) {
			overlay.classList.add('active'); 

			
			setTimeout(() => {
				window.open(link, '_blank');
			}, 600);
		}
	});
});

// Home.js
import React from 'react';
import '../styles/Home.css';
import { Carousel } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero секция */}
      <section className="hero">
        <div className="hero__text container">
          <h1>ПАНСИОНАТ ЛЕСНЫЕ ДАЛИ</h1>
          <p>ВАШ ДОМ ВДАЛИ ОТ ДОМА</p>
        </div>
      </section>

      {/* Секция проживание */}
      <section className="live">
        <div className="container">
          <div className="live__top-content">
            <h2 className="live-title">ПРОЖИВАНИЕ</h2>
            <Link className="live__link" to="/rooms">Смотреть все</Link>
          </div>
          <div className="live__bottom-content live-cards">
            {[
              {
                id: 1,
                img: "/img/live_card-image.png",
                title: "Одноместный стандарт",
                desc: "Однокомнатный номер, без балкона, корпус 1, этаж 1. Площадь номера 19 м2",
                price: "7 380"
              },
              {
                id: 2,
                img: "/img/live_card-image3.png",
                title: "Двуместный стандарт",
                desc: "Однокомнатный номер с выходом на террасу, корпус 5. Площадь номера 19 м2.",
                price: "7 380"
              },
              {
                id: 3,
                img: "/img/live_card-image8.png",
                title: "Семейный",
                desc: "Двухкомнатный номер с балконом, корпус 2. Площадь номера 37 м2.",
                price: "7 380"
              }
            ].map(room => (
              <div className="card__item" key={room.id}>
                <img src={room.img} alt={room.title} />
                <div className="card-text">
                  <div className="card-title">
                    <h3>{room.title}</h3>
                    <div className="rating">
                      <img src="/img/star-icon.png" alt="Рейтинг" />
                      <p>5.0</p>
                    </div>
                  </div>
                  <p>{room.desc}</p>
                  <p className="card-text__price">от <span>{room.price}</span> руб/сутки</p>
                </div>
                <Link to="/basket" className="card-btn">ЗАБРОНИРОВАТЬ</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Секция акции */}
      <section className="sale container">
        <h2>АКЦИИ</h2>
        <Carousel>
          {[
            {
              id: 1,
              img: "/img/pensioners.jpeg",
              title: "СКИДКА ПЕНСИОНЕРАМ",
              desc: "При предъявлении пенсионного удостоверения предоставляется скидка на проживание в размере 10%"
            },
            {
              id: 2,
              img: "/img/happy-birthday.jpg",
              title: "ДЕНЬ РОЖДЕНИЯ",
              desc: "Скидка 10% на проживание за 7 дней до и 7 дней после даты дня рождения."
            },
            {
              id: 3,
              img: "/img/family.jpeg",
              title: "РАННЕЕ БРОНИРОВАНИЕ",
              desc: "Скидка 10% при бронировании за 30 дней до заезда"
            }
          ].map(promo => (
            <Carousel.Item key={promo.id}>
              <img
                className="d-block w-100"
                src={promo.img}
                alt={promo.title}
              />
              <Carousel.Caption>
                <h2>{promo.title}</h2>
                <h4>{promo.desc}</h4>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Секция контакты */}
      <section className="contact container">
        <h2>КОНТАКТЫ</h2>
        <div className="contact__content">
          <div className="contact__text points">
            <div className="map point">
              <img src="/img/pin-map.svg" alt="Адрес" />
              <p>
                Россия, респ. Татарстан, Альметьевский р-н, с. Поташная Поляна,
                ул. Сосновая, 1Б
              </p>
            </div>
            <div className="tel point">
              <img src="/img/phone.svg" alt="Телефон" />
              <p>8 (951) 893-46-59</p>
            </div>
            <div className="mail point">
              <img src="/img/mail.svg" alt="Почта" />
              <p>lesnaya_dolina@mail.com</p>
            </div>
          </div>
          {/* <div className="maps">
            <iframe 
              title="Яндекс Карта"
              src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A29177a24607efd86d64ea0b772c244c86308c456a349d9fe6c4fa861e76eb789&amp;width=300&amp;height=369&amp;lang=ru_RU&amp;scroll=true"
              width="300" 
              height="369" 
              frameBorder="0"
            ></iframe>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Home;
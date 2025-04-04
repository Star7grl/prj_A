import React, { useEffect, useState } from "react";
import ServicesApi from "../config/servicesApi";
import { Link } from "react-router-dom";
import '../styles/Service.css'

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await ServicesApi.getAllServices();
                console.log("API response:", data);
                setServices(data.services || []);
            } catch (error) {
                console.error("Ошибка загрузки услуг:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) return <div>Загрузка...</div>;

    return (
        <section className="services">
            <div className="container">
                <div className="services__top-content">
                    <h2 className="services-title">УСЛУГИ</h2>
                    <Link className="services__link" to="/">На главную</Link>
                </div>
                <div className="services__bottom-content services-cards">
                    {services.map((service) => (
                        <div className="card__item" key={service.serviceId}>
                            <img src="/img/service_default.jpg" alt={service.serviceName} />
                            <div className="card-text">
                                <h3 className="card-title">{service.serviceName}</h3>
                                <p>Описание услуги можно добавить в API</p>
                                <p className="card-text__price"><span>{service.servicePrice}</span> руб</p>
                            </div>
                            <Link to="/order" className="card-btn">ЗАКАЗАТЬ</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesPage;
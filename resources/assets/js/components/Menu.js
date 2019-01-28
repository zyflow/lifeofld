import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {trans} from '../Helper';

export default class Menu extends Component {
    mobileResize() {
        var menu = document.querySelector(".menu"),
            content = document.querySelector(".right-content");

        if (window.innerWidth <= 1024) {
             menu.classList.add("mobile");
             content.classList.add("mobile");
        } else {
            menu.classList.remove("mobile");
            content.classList.remove("mobile");
        }
    }

    componentDidMount() {
        var self = this;

        $(".links").find("a[href='" + location.pathname + "']").parent().addClass("active");

        self.mobileResize();
        window.addEventListener('resize', self.mobileResize)
    }

    componentWillUnmount() {
        var self = this;

        window.removeEventListener('resize', self.handleResize)
    }

    toggleMenu(el) {
        $(el.currentTarget).closest(".menu").toggleClass("mobile");
        $(".right-content").toggleClass("mobile");
    }

    render() {
        var self = this;

        return (
            <div className="menu">
                <div className="title">
                    { document.title.split(" | ")[0] }
                    <div className="switch-mobile" onClick={self.toggleMenu.bind(self)}>
                        <img src="/img/mobile.svg" />
                    </div>
                </div>
                <div className="switch-desktop" onClick={self.toggleMenu.bind(self)}>
                    <img src="/img/desktop.svg" />
                </div>
                <ul className="links">
                    <li>
                        <a className="menu-icon" href="/home">
                            <img src="/img/dashboard.svg" />
                            <span>{trans('menu', 'dashboard')}</span>
                        </a>
                    </li>
                    <li>
                        <a className="menu-icon user" href="/user-admin">
                            <img src="/img/user.svg" />
                            <span>{trans('menu', 'user_admin')}</span>
                        </a>
                    </li>
                    <li>
                        <a className="menu-icon kommune" href="/commune-setup">
                            <img src="/img/kommune.svg" />
                            <span>{trans('menu', 'commune_setup')}</span>
                        </a>
                    </li>
                    <li>
                        <a className="menu-icon budget" href="/budget-import">
                            <img src="/img/budget.svg" />
                            <span>{trans('menu', 'budget_import')}</span>
                        </a>
                    </li>
                    <li>
                        <a className="menu-icon export" href="/export-til-economic">
                            <img src="/img/export.svg" />
                            <span>{trans('menu', 'export_economics')}</span>
                        </a>
                    </li>
                    <li>
                        <a className="menu-icon dashboard" href="/settings">
                            <img src="/img/dashboard.svg" />
                            <span>{trans('menu', 'settings')}</span>
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

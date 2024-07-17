# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

This project was completed as part of a bootcamp learning process, designed to apply and demonstrate newly acquired skills in web development and security. The goal was to build a functional and secure web application, incorporating essential features such as user authentication, session management, and URL shortening.

## Final Product (screenshots)

!["Main page"](https://github.com/AD202310/tinyapp/blob/main/docs/urls-page.png?raw=true)
!["My URLs page when logged in"](https://github.com/AD202310/tinyapp/blob/main/docs/my-urls.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Functionality

- Short URL Creation: Converts long URLs (e.g. http://www.google.com) into short, encrypted URL IDs (e.g. 4spqk1)
- Interface: Provides a user-friendly interface for managing existing shortened URLs, including viewing, updating, and deleting them (CRUD)

- User Authentication: Allows users to securely log in using their credentials (e.g. email and password)
- Session Management: Maintains user sessions, ensuring that users remain logged in across multiple pages



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { createGlobalStyle } from "styled-components";
import Header from './Components/Header';

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
@font-face {
  font-family: 'Double Trouble Sara';
  font-style: normal;
  font-weight: normal;
  src:  local('Double Trouble Sara'),
        url('fonts/DoubleTroubleSaraRegular-1j85g.woff') format('woff');
}
@font-face {
    font-family: 'YoonchoUsanChildrenS';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408@1.0/YoonChildfundkoreaDaeHan.woff2') format('woff2');
    font-weight: normal;
    font-display: swap;
}
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  caret-color: transparent;
  user-select: none;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
  -ms-overflow-style: none;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-family: 'Source Sans Pro', sans-serif;
  /* background: linear-gradient(180deg, ${({theme})=>theme.bgA} 0%, ${({theme})=>theme.bgB} 100%); */
  color: black;
  line-height: 1.2;
  margin: 0;
  background: url("images/food.png") no-repeat center center fixed;
  background-size: cover;
  background-attachment: fixed;
}
a {
  text-decoration:none;
  color:inherit;
}
input {
  caret-color: black;
}
::-webkit-scrollbar {
  display: none;
}
.box{
  -ms-overflow-style: none;
}
.box::-webkit-scrollbar{
  display:none;
}
`;

export const Page = styled.div`
  min-height: 100dvh;
  /* background: linear-gradient(180deg, ${({theme})=>theme.bgA} 0%, ${({theme})=>theme.bgB} 100%); */
  display: flex; flex-direction: column;
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
        <Page>
          <Header />
          <App />
        </Page>
    </ThemeProvider>
  // </React.StrictMode>
);

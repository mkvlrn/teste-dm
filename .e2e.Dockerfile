FROM mcr.microsoft.com/playwright:latest

WORKDIR /tests

RUN npm init -y
RUN npm i @playwright/test
RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]

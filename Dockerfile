# https://stackoverflow.com/questions/71135033/nodejs-selenium-webdriver-for-linux-chrome-docker-image

# 1) Use alpine-based NodeJS base image
FROM node:latest

# 2) Install latest stable Chrome
# https://gerg.dev/2021/06/making-chromedriver-and-chrome-versions-match-in-a-docker-image/
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | \
    tee -a /etc/apt/sources.list.d/google.list && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | \
    apt-key add - && \
    apt-get update && \
    apt-get install -y google-chrome-stable libxss1

# 3) Install the Chromedriver version that corresponds to the installed major Chrome version
# https://blogs.sap.com/2020/12/01/ui5-testing-how-to-handle-chromedriver-update-in-docker-image/
RUN google-chrome --version | grep -oE "[0-9]{1,10}.[0-9]{1,10}.[0-9]{1,10}" > /tmp/chromebrowser-main-version.txt
RUN wget --no-verbose -O /tmp/latest_chromedriver_version.txt https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$(cat /tmp/chromebrowser-main-version.txt)
RUN wget --no-verbose -O /tmp/chromedriver_linux64.zip https://chromedriver.storage.googleapis.com/$(cat /tmp/latest_chromedriver_version.txt)/chromedriver_linux64.zip && rm -rf /opt/selenium/chromedriver && unzip /tmp/chromedriver_linux64.zip -d /opt/selenium && rm /tmp/chromedriver_linux64.zip && mv /opt/selenium/chromedriver /opt/selenium/chromedriver-$(cat /tmp/latest_chromedriver_version.txt) && chmod 755 /opt/selenium/chromedriver-$(cat /tmp/latest_chromedriver_version.txt) && ln -fs /opt/selenium/chromedriver-$(cat /tmp/latest_chromedriver_version.txt) /usr/bin/chromedriver

# 4) Set the variable for the container working directory & create the working directory
ARG WORK_DIRECTORY=/program
RUN mkdir -p $WORK_DIRECTORY
WORKDIR $WORK_DIRECTORY

# 5) Install npm packages (do this AFTER setting the working directory)
# RUN #npm config set unsafe-perm true
RUN npm i selenium-webdriver --unsafe-perm=true --allow-root
ENV NODE_ENV=development NODE_PATH=$WORK_DIRECTORY

# 6) Copy script to execute to working directory
COPY ./ $WORK_DIRECTORY


EXPOSE 8080

# 7) Execute the script in NodeJS
 RUN cd $WORK_DIRECTORY
CMD ["npm", "install"]
CMD ["node", "./src/index.js"]

# docker build -t "currency-crawler" -f Dockerfile .
# docker run --name currency-crawler-container -d -p 8080:8080 currency-crawler
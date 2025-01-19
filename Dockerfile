# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js project
RUN npm run build

# Production environment
FROM node:18 AS production

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files (from the build stage)
COPY --from=build /app /app

# Install production dependencies
RUN npm install --only=production

# Expose the port Next.js will run on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]

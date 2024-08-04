FROM ubuntu

# Use an official Python runtime as a parent image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the backend port
EXPOSE 8080

# Run the application
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8080"]
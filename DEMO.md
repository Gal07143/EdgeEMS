# Gridwise Optimizer Demo Environment

This document provides instructions for deploying and managing the Gridwise Optimizer demo environment.

## Prerequisites

- Docker and Docker Compose installed
- Git
- At least 4GB of available RAM
- At least 10GB of available disk space

## Configuration

1. Copy the example environment file:
   ```bash
   cp .env.demo.example .env.demo
   ```

2. Update the environment variables in `.env.demo` with your specific values:
   - Database credentials
   - Supabase configuration
   - MQTT credentials
   - JWT and encryption keys
   - Monitoring settings

## Deployment

1. Make the deployment script executable:
   ```bash
   chmod +x deploy-demo.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy-demo.sh
   ```

The script will:
- Create necessary directories
- Configure MQTT broker
- Pull Docker images
- Build and start services
- Initialize the database

## Accessing the Demo

- Frontend: http://localhost
- Backend API: http://localhost:8000
- MQTT Broker: localhost:1883

## Monitoring

- Logs can be viewed using:
  ```bash
  docker-compose -f docker-compose.demo.yml logs -f
  ```

- For specific service logs:
  ```bash
  docker-compose -f docker-compose.demo.yml logs -f [service_name]
  ```

## Maintenance

### Updating the Demo

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild and restart services:
   ```bash
   docker-compose -f docker-compose.demo.yml up -d --build
   ```

### Backup and Restore

1. Backup database:
   ```bash
   docker-compose -f docker-compose.demo.yml exec postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup.sql
   ```

2. Restore database:
   ```bash
   docker-compose -f docker-compose.demo.yml exec -T postgres psql -U ${POSTGRES_USER} ${POSTGRES_DB} < backup.sql
   ```

## Troubleshooting

1. If services fail to start:
   - Check logs: `docker-compose -f docker-compose.demo.yml logs`
   - Verify environment variables
   - Ensure ports are not in use

2. Database connection issues:
   - Verify PostgreSQL credentials in `.env.demo`
   - Check if PostgreSQL container is running
   - Ensure database initialization completed successfully

3. MQTT connection issues:
   - Verify MQTT credentials
   - Check MQTT broker logs
   - Ensure ports 1883 and 9001 are available

## Security Notes

- The demo environment is not suitable for production use
- Default credentials should be changed before deployment
- Regular security updates should be applied
- Monitor logs for suspicious activity

## Support

For issues or questions:
1. Check the troubleshooting guide
2. Review application logs
3. Contact the development team 
# Database Documentation

## Overview
This document provides a comprehensive overview of the database schema for the application.

## Entity-Relationship Diagram (ERD)
![ERD Diagram](link_to_erd_diagram)

## Tables
1. **users**: This table stores user information such as username, password, and email.
2. **municipalities**: This table contains details about various municipalities.
3. **reports**: This table holds reports submitted by users.
4. **report_votes**: This table manages votes associated with each report.
5. **report_comments**: This table consists of comments made on reports.

## PostgreSQL and PostGIS
- Spatial queries using PostGIS can be executed to analyze geographical data.
- Indexes and triggers are defined to enhance data integrity and performance.

## Alembic Migration Commands
- Migrations can be handled using Alembic to manage database schema changes effectively.
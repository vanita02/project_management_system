#!/bin/bash

# 🚀 Production Deployment Script for Vercel

echo "🚀 Starting production deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_status "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_status "Dependencies installed successfully"
}

# Generate Prisma client
generate_prisma() {
    print_status "Generating Prisma client..."
    npm run postinstall
    if [ $? -ne 0 ]; then
        print_error "Failed to generate Prisma client"
        exit 1
    fi
    print_status "Prisma client generated successfully"
}

# Run type checking
type_check() {
    print_status "Running TypeScript type check..."
    npm run type-check
    if [ $? -ne 0 ]; then
        print_warning "TypeScript errors found, but continuing..."
    else
        print_status "TypeScript check passed"
    fi
}

# Run linting
lint_check() {
    print_status "Running ESLint..."
    npm run lint
    if [ $? -ne 0 ]; then
        print_warning "Linting errors found, but continuing..."
    else
        print_status "Linting check passed"
    fi
}

# Build the application
build_app() {
    print_status "Building application for production..."
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Build failed"
        exit 1
    fi
    print_status "Build completed successfully"
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    # Check if .env.local exists (for local testing)
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Make sure environment variables are set in Vercel dashboard."
    fi
    
    # Required environment variables
    required_vars=("DATABASE_URL" "JWT_SECRET" "NEXTAUTH_URL" "NEXTAUTH_SECRET")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_warning "$var is not set in local environment"
            print_warning "Make sure to set it in Vercel dashboard"
        fi
    done
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_status "Please log in to Vercel:"
        vercel login
    fi
    
    # Deploy
    vercel --prod
    if [ $? -ne 0 ]; then
        print_error "Deployment failed"
        exit 1
    fi
    
    print_status "Deployment completed successfully!"
}

# Main deployment flow
main() {
    print_status "Starting production deployment process..."
    
    check_dependencies
    install_dependencies
    generate_prisma
    type_check
    lint_check
    check_env_vars
    build_app
    
    print_status "Local build completed successfully!"
    print_status "Ready to deploy to Vercel."
    
    read -p "Do you want to deploy to Vercel now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_to_vercel
    else
        print_status "Deployment cancelled. Run 'vercel --prod' when ready to deploy."
    fi
    
    print_status "🎉 Deployment process completed!"
}

# Handle script interruption
trap 'print_warning "Deployment interrupted"; exit 1' INT

# Run main function
main "$@"

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const marketplace = new AWS.MarketplaceMetering();

const SUBSCRIBERS_TABLE = process.env.SUBSCRIBERS_TABLE;
const METERING_TABLE = process.env.METERING_TABLE;
const PRODUCT_CODE = process.env.PRODUCT_CODE;
const LISTING_NAME = process.env.LISTING_NAME;

exports.handler = async (event) => {
    console.log('Registration request:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { regToken, firstName, lastName, contactEmail, productCode } = body;

        if (!regToken) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Registration token is required. Please access this page through AWS Marketplace.' 
                })
            };
        }

        if (!firstName || !lastName || !contactEmail) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'First name, last name, and email are required.' 
                })
            };
        }

        // Resolve customer from AWS Marketplace
        let customerData;
        try {
            const resolveResult = await marketplace.resolveCustomer({
                RegistrationToken: regToken
            }).promise();
            
            customerData = {
                customerIdentifier: resolveResult.CustomerIdentifier,
                productCode: resolveResult.ProductCode || PRODUCT_CODE
            };
            
            console.log('Resolved customer:', customerData);
        } catch (error) {
            console.error('Error resolving customer:', error);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid registration token. Please try again from AWS Marketplace.' 
                })
            };
        }

        // Store subscriber information
        const subscriberRecord = {
            customerIdentifier: customerData.customerIdentifier,
            productCode: customerData.productCode,
            firstName,
            lastName,
            contactEmail,
            contactPerson: `${firstName} ${lastName}`,
            registrationDate: new Date().toISOString(),
            listingName: LISTING_NAME,
            status: 'REGISTERED'
        };

        await dynamodb.put({
            TableName: SUBSCRIBERS_TABLE,
            Item: subscriberRecord
        }).promise();

        // Log initial metering record
        const meteringRecord = {
            customerIdentifier: customerData.customerIdentifier,
            timestamp: new Date().toISOString(),
            productCode: customerData.productCode,
            dimension: 'Users',
            quantity: 1,
            event: 'REGISTRATION'
        };

        await dynamodb.put({
            TableName: METERING_TABLE,
            Item: meteringRecord
        }).promise();

        console.log('Registration completed successfully:', subscriberRecord);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                message: `Registration successful for ${LISTING_NAME}! Welcome ${firstName}. You will receive setup instructions via email shortly.`,
                customerIdentifier: customerData.customerIdentifier
            })
        };

    } catch (error) {
        console.error('Registration error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Registration failed. Please try again or contact support.' 
            })
        };
    }
};
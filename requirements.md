# Project Requirements

## Vision

1. What is the vision of this product?
   To provide a user with fast updates on real estate listings via text.

2. What pain point does this project solve?
   The real estate market moves fast, users don't want doom scroll sites like Redfin and Zillow for relevant listings. This app will provide you only with what's new and what meets your criteria, as soon as it comes on the market.

3. Why should we care about your product?
   If you're buying a house, especially in a hot market, you will want to have updates early and often. It will allow you to be competitive and keep your finger on the pulse without wasting your time like those other real estate sites.

## Scope

This product will text the user with relevant details about a new house that meets that users search criteria. The user will be able to create more than one filter and delete filters they no longer find relevant. Users can sign up securely and will only receive texts relevant to their specific filters. Users will only be able to search in Portland, OR.

This product will not be a real estate listing site, it is only an alert application. Also will not be sending cat pics.

MVP is what was mentioned above, a stretch goal would be to expand outside of the Portland market or to expand to more than just texting for alerts.

### Functional Requirements

1. A user can sign up for an account with their cell number
2. A user can create a filter for real estate listings
3. A user will receive SMS notifications when a new listing that meets their criteria goes on the market
4. A user can delete a filter

### Non-Functional Requirements

1. Our app will provide user security by hashing user passwords before storing
2. Our app will test all routes for editing the database
3. Our app will scrape current and future real estate listings from popular site(s)

#### Data Flow

A user signs up and logs in. They will create a filter with various search parameters and then receive text messages when new listing are added based on those search parameters. A user can delete filters that are no longer relevant.

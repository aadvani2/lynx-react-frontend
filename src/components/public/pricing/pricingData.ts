import type { PricingPlan } from './types';

export const pricingPlans: PricingPlan[] = [
  {
    id: 11,
    name: 'Free',
    price: 'FREE',
    description: 'Homeowners and renters who want to explore Lynx\'s all essential features with no financial commitment.',
    priceId: 'price_1RLjqiD0X9PiOCIu5wlECLkL',
    gradientColor: '#349DEB40',
    features: [
      {
        text: 'Scheduled service',
        included: true,
        tooltip: 'Pick your date & time - set it and forget it.'
      },
      {
        text: 'Urgent service',
        included: true,
        tooltip: 'Service within 24 hours - because waiting is overrated.'
      },
      {
        text: 'Emergency service - $60 per request',
        included: true,
        tooltip: 'Need help now? A pro arrives within 4 hours.'
      },
      {
        text: 'Home Planner (Coming Soon)',
        included: false,
        tooltip: 'Keep your home in check - track services, costs & maintenance like a pro.'
      },
      {
        text: 'Marketplace (Coming Soon)',
        included: true,
        tooltip: 'Unlock exclusive deals with top-tier pros.'
      },
      {
        text: 'Manage 1 property',
        included: true,
        tooltip: 'How many places do you need covered?'
      }
    ]
  },
  {
    id: 12,
    name: 'Premium',
    price: '$150.00',
    period: 'Year',
    description: 'For proactive homeowners who want more control and faster service.',
    priceId: 'price_1RLjqbD0X9PiOCIu2w1pz7qW',
    gradientColor: '#DA7DFF40',
    features: [
      {
        text: 'Scheduled service',
        included: true,
        tooltip: 'Pick your date & time - set it and forget it.'
      },
      {
        text: 'Urgent service',
        included: true,
        tooltip: 'Service within 24 hours - because waiting is overrated.'
      },
      {
        text: 'Emergency service - 2 free per year, then $30 per request',
        included: true,
        tooltip: 'Need help now? A pro arrives within 4 hours.'
      },
      {
        text: 'Home Planner (Coming Soon) - Standard features',
        included: true,
        tooltip: 'Keep your home in check - track services, costs & maintenance like a pro.'
      },
      {
        text: 'Marketplace (Coming Soon)',
        included: true,
        tooltip: 'Unlock exclusive deals with top-tier pros.'
      },
      {
        text: 'Manage up to 3 properties',
        included: true,
        tooltip: 'How many places do you need covered?'
      }
    ]
  },
  {
    id: 13,
    name: 'Corporate',
    price: '$500.00',
    period: 'Year',
    description: 'For landlords, property managers, or teams managing multiple locations.',
    priceId: 'price_1RLjqcD0X9PiOCIu2w1pz7qX',
    isComingSoon: true,
    gradientColor: '#F1B60040',
    features: [
      {
        text: 'Scheduled service',
        included: true,
        tooltip: 'Pick your date & time - set it and forget it.'
      },
      {
        text: 'Urgent service',
        included: true,
        tooltip: 'Service within 24 hours - because waiting is overrated.'
      },
      {
        text: 'Emergency service - $60 per request',
        included: true,
        tooltip: 'Need help now? A pro arrives within 4 hours.'
      },
      {
        text: 'Home Planner (Coming Soon)',
        included: true,
        tooltip: 'Keep your home in check - track services, costs & maintenance like a pro.'
      },
      {
        text: 'Marketplace (Coming Soon)',
        included: true,
        tooltip: 'Unlock exclusive deals with top-tier pros.'
      },
      {
        text: 'Multi-property management dashboard',
        included: true,
        tooltip: 'How many places do you need covered?'
      }
    ]
  }
]; 
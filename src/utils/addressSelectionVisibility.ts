import { type ProviderListVisibility, type ContactInformationVisibility, type ProviderLoaderVisibility, type NoProviderAlertVisibility, type PreviousButtonVisibility } from '../types/components';

export function shouldShowProviderList({ addresses, showAddressEditor, showProviderList, fromSearch }: ProviderListVisibility): boolean {
  if (fromSearch) return false; // don't show list in search flow
  if (!addresses.length || showAddressEditor || !showProviderList) return false;
  return true;
}

export function shouldShowContactInformation({ addresses, showAddressEditor, showContactInformation, fromSearch, showNoProviderAlert }: ContactInformationVisibility): boolean {
  if (showAddressEditor) return false;

  if (fromSearch) {
    // Show if coming from search and providers available and no alert
    return addresses.length > 0 && !showNoProviderAlert && showContactInformation;
  } else {
    return addresses.length > 0 && showContactInformation;
  }
}

export function shouldShowProviderLoader({ showProviderLoader, showAddressEditor, fromSearch, showContactInformation }: ProviderLoaderVisibility): boolean {
  return !fromSearch && !showAddressEditor && showProviderLoader && !showContactInformation;
}

export function shouldShowNoProviderAlert({ showNoProviderAlert, showAddressEditor, fromSearch }: NoProviderAlertVisibility): boolean {
  if (showAddressEditor) return false;
  if (fromSearch) return showNoProviderAlert; // show alert if coming from search
  return showNoProviderAlert;
}

export function shouldShowPreviousButton({ showContactInformation, fromSearch }: PreviousButtonVisibility): boolean {
  return !fromSearch && !showContactInformation;
}

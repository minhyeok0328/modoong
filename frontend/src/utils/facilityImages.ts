/**
 * Utility functions for handling facility images
 */

// Array of available facility images
const FACILITY_IMAGES = [
  '/images/facility1.jpg',
  '/images/facility2.jpg',
  '/images/facility3.jpg',
  '/images/facility4.jpg',
  '/images/facility5.jpg',
  '/images/facility6.jpg',
] as const;

// Fallback image for when no facility images are available
const DEFAULT_FACILITY_IMAGE = '/images/356824_168381_1731.jpg';

/**
 * Returns a random facility image from the available facility images
 * @returns A random facility image path
 */
export function getRandomFacilityImage(): string {
  const randomIndex = Math.floor(Math.random() * FACILITY_IMAGES.length);
  return FACILITY_IMAGES[randomIndex];
}

/**
 * Returns a deterministic facility image based on a seed (like facility ID)
 * This ensures the same facility always gets the same image
 * @param seed - A number or string to use as seed for deterministic selection
 * @returns A facility image path based on the seed
 */
export function getFacilityImageBySeed(seed: string | number): string {
  let numericSeed: number;
  
  if (typeof seed === 'string') {
    // Convert string to numeric seed by summing character codes
    numericSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  } else {
    numericSeed = seed;
  }
  
  const imageIndex = numericSeed % FACILITY_IMAGES.length;
  return FACILITY_IMAGES[imageIndex];
}

/**
 * Returns a facility image with fallback logic
 * Priority: provided image > base64 image > deterministic image by seed > default image
 * @param options - Object containing image options
 * @returns The appropriate facility image path
 */
export function getFacilityImage(options: {
  imageSrc?: string | null;
  facilityImageBase64?: string | null;
  facilityId?: string | number;
  useRandom?: boolean;
}): string {
  const { imageSrc, facilityImageBase64, facilityId, useRandom = false } = options;
  
  // First priority: base64 image
  if (facilityImageBase64) {
    return facilityImageBase64;
  }
  
  // Second priority: provided image source
  if (imageSrc && imageSrc.length > 0) {
    return imageSrc;
  }
  
  // Third priority: deterministic image by facility ID
  if (facilityId && !useRandom) {
    return getFacilityImageBySeed(facilityId);
  }
  
  // Fourth priority: random image (if explicitly requested)
  if (useRandom) {
    return getRandomFacilityImage();
  }
  
  // Fallback: default image
  return DEFAULT_FACILITY_IMAGE;
}

/**
 * Get all available facility images
 * @returns Array of all facility image paths
 */
export function getAllFacilityImages(): readonly string[] {
  return FACILITY_IMAGES;
}
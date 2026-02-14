/**
 * Production-safe data loading utility
 * Fetches from /public/data/ directory which is accessible in both dev and production
 */

export async function loadProfile() {
  try {
    const response = await fetch('/data/profile.json')
    if (!response.ok) {
      throw new Error(`Failed to load profile: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading profile:', error)
    return null
  }
}

export async function loadProjects() {
  try {
    const response = await fetch('/data/projects.json')
    if (!response.ok) {
      throw new Error(`Failed to load projects: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading projects:', error)
    return null
  }
}

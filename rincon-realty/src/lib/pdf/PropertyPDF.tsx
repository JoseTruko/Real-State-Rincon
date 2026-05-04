import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { SITE_NAME } from '@/config/site'
import { localizedField, formatPrice, formatArea } from '@/lib/utils/format'
import type { Property, Locale } from '@/types'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FAFAF9',
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1A3A2A',
  },
  siteName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#C5973A',
  },
  date: {
    fontSize: 9,
    color: '#6b7280',
  },
  heroImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1C2833',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1A5276',
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1A3A2A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  gridLabel: {
    fontSize: 8,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1C2833',
  },
  description: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
  },
  agentSection: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1C2833',
    marginBottom: 2,
  },
  agentDetail: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 1,
  },
  disclaimer: {
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  imageGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  thumbImage: {
    flex: 1,
    height: 80,
    objectFit: 'cover',
    borderRadius: 4,
  },
})

interface PropertyPDFProps {
  property: Property
  locale: Locale
}

export function PropertyPDF({ property, locale }: PropertyPDFProps) {
  const title = localizedField(property, 'title', locale)
  const description = localizedField(property, 'description', locale)
  const images = property.images ?? []
  const heroImage = images[0]
  const thumbImages = images.slice(1, 4)

  const typeLabels: Record<string, string> = {
    house: locale === 'es' ? 'Casa' : 'House',
    land:  locale === 'es' ? 'Terreno' : 'Land',
    farm:  locale === 'es' ? 'Finca' : 'Farm',
  }

  return (
    <Document title={title} author={SITE_NAME}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.siteName}>{SITE_NAME}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {/* Hero image */}
        {heroImage && (
          <Image src={heroImage.url} style={styles.heroImage} />
        )}

        {/* Thumbnail images */}
        {thumbImages.length > 0 && (
          <View style={styles.imageGrid}>
            {thumbImages.map((img) => (
              <Image key={img.id} src={img.url} style={styles.thumbImage} />
            ))}
          </View>
        )}

        {/* Title & Price */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{formatPrice(property.price_usd, locale)}</Text>

        {/* Key specs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {locale === 'es' ? 'Detalles' : 'Details'}
          </Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{locale === 'es' ? 'Tipo' : 'Type'}</Text>
              <Text style={styles.gridValue}>{typeLabels[property.type]}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{locale === 'es' ? 'Área' : 'Area'}</Text>
              <Text style={styles.gridValue}>{formatArea(property.area_m2, locale)}</Text>
            </View>
            {property.bedrooms != null && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>{locale === 'es' ? 'Habitaciones' : 'Bedrooms'}</Text>
                <Text style={styles.gridValue}>{property.bedrooms}</Text>
              </View>
            )}
            {property.bathrooms != null && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>{locale === 'es' ? 'Baños' : 'Bathrooms'}</Text>
                <Text style={styles.gridValue}>{property.bathrooms}</Text>
              </View>
            )}
            {property.year_built && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>{locale === 'es' ? 'Año' : 'Year built'}</Text>
                <Text style={styles.gridValue}>{property.year_built}</Text>
              </View>
            )}
            {property.community && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>{locale === 'es' ? 'Comunidad' : 'Community'}</Text>
                <Text style={styles.gridValue}>
                  {localizedField(property.community, 'name', locale)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {locale === 'es' ? 'Descripción' : 'Description'}
            </Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

        {/* Agent */}
        {property.agent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {locale === 'es' ? 'Agente' : 'Agent'}
            </Text>
            <View style={styles.agentSection}>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{property.agent.full_name}</Text>
                <Text style={styles.agentDetail}>{localizedField(property.agent, 'title', locale)}</Text>
                {property.agent.email && (
                  <Text style={styles.agentDetail}>{property.agent.email}</Text>
                )}
                {property.agent.phone && (
                  <Text style={styles.agentDetail}>{property.agent.phone}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Information subject to change. Contact agent for latest details. | {SITE_NAME}
        </Text>
      </Page>
    </Document>
  )
}

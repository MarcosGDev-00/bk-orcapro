import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 10, color: '#1e293b' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50 },
  logo: { width: 80, height: 80, objectFit: 'contain' },
  companyInfo: { textAlign: 'right', color: '#64748b' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#0f172a', letterSpacing: -1 },
  clientSection: { marginBottom: 40, padding: 20, backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 12, color: '#6366f1', textTransform: 'uppercase' },
  table: { width: '100%', marginBottom: 40 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#f1f5f9', paddingBottom: 10, marginBottom: 10 },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'center' },
  col3: { flex: 1, textAlign: 'right' },
  col4: { flex: 1.2, textAlign: 'right', fontWeight: 'bold' },
  totals: { width: 220, alignSelf: 'flex-end', padding: 20, backgroundColor: '#f8fafc', borderRadius: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  totalText: { fontSize: 14, fontWeight: 'bold', color: '#6366f1' },
  footer: { position: 'absolute', bottom: 40, left: 50, right: 50, textAlign: 'center', color: '#94a3b8', fontSize: 9, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 },
  notes: { marginTop: 40, padding: 20, borderLeftWidth: 4, borderLeftColor: '#6366f1', backgroundColor: '#f8fafc', borderRadius: '0 8 8 0' }
});

export const QuoteDocument = ({ quote, profile, client }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          {profile?.logo_url ? <Image style={styles.logo} src={{ uri: profile.logo_url, method: 'GET', headers: {}, body: '' }} /> : <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{profile?.company_name || 'Empresa'}</Text>}
        </View>
        <View style={styles.companyInfo}>
          <Text style={{ fontWeight: 'bold', color: '#18160F' }}>{profile?.company_name || 'Sua Empresa'}</Text>
          {profile?.document && <Text>{profile.document}</Text>}
          {profile?.email && <Text>{profile.email}</Text>}
          {profile?.phone && <Text>{profile.phone}</Text>}
          {profile?.address && <Text>{profile.address}</Text>}
        </View>
      </View>

      <Text style={styles.title}>ORÇAMENTO {quote.number ? `#${quote.number}` : ''}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <View>
          <Text style={{ color: '#6E6A62', marginBottom: 4 }}>Data: {new Date(quote.created_at || Date.now()).toLocaleDateString('pt-BR')}</Text>
          {quote.valid_until && <Text style={{ color: '#6E6A62' }}>Válido até: {new Date(`${quote.valid_until}T12:00:00`).toLocaleDateString('pt-BR')}</Text>}
        </View>
      </View>

      <View style={styles.clientSection}>
        <Text style={styles.sectionTitle}>CLIENTE</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>{client?.name || 'Cliente Não Informado'}</Text>
        {client?.company && <Text>{client.company}</Text>}
        {client?.document && <Text>{client.document}</Text>}
        {client?.email && <Text>{client.email}</Text>}
        {client?.phone && <Text>{client.phone}</Text>}
        {client?.address && <Text>{client.address}</Text>}
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Descrição</Text>
          <Text style={styles.col2}>Qtd</Text>
          <Text style={styles.col3}>V. Unit</Text>
          <Text style={styles.col4}>Total</Text>
        </View>
        {quote.items?.map((item: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>R$ {Number(item.unit_price).toFixed(2)}</Text>
            <Text style={styles.col4}>R$ {(item.quantity * item.unit_price).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>Subtotal</Text>
          <Text>R$ {Number(quote.subtotal || 0).toFixed(2)}</Text>
        </View>
        {Number(quote.discount) > 0 && (
          <View style={styles.totalRow}>
            <Text>Desconto</Text>
            <Text>-R$ {Number(quote.discount || 0).toFixed(2)}</Text>
          </View>
        )}
        <View style={[styles.totalRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E4E0D8' }]}>
          <Text style={styles.totalText}>TOTAL</Text>
          <Text style={styles.totalText}>R$ {Number(quote.total || 0).toFixed(2)}</Text>
        </View>
      </View>

      {quote.notes && (
        <View style={styles.notes}>
          <Text style={styles.sectionTitle}>OBSERVAÇÕES</Text>
          <Text>{quote.notes}</Text>
        </View>
      )}

      <Text style={styles.footer}>Gerado pelo OrçaPro</Text>
    </Page>
  </Document>
);

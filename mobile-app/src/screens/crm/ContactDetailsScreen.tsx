import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Contact, RootStackParamList } from '../../types/crm';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type ContactDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ContactDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ContactDetails'>;

export const ContactDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ContactDetailsScreenNavigationProp>();
  const route = useRoute<ContactDetailsScreenRouteProp>();
  const { contactId } = route.params;

  const [contact, setContact] = useState<Partial<Contact>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(contactId !== 'new');
  const [saving, setSaving] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (contactId !== 'new') {
      loadContact();
    }
  }, [contactId]);

  const loadContact = async () => {
    try {
      const response = await api.getContact(contactId);
      setContact(response.data);
    } catch (error) {
      console.error('Failed to load contact:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails du contact');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contact.first_name || !contact.last_name || !contact.email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSaving(true);
      if (contactId === 'new') {
        await api.createContact(contact as Omit<Contact, 'id' | 'created_at' | 'updated_at'>);
      } else {
        await api.updateContact(contactId, contact);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save contact:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le contact');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      return;
    }

    try {
      const response = await api.addNote(contactId, noteContent);
      setContact(response.data);
      setNoteContent('');
    } catch (error) {
      console.error('Failed to add note:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await api.deleteNote(contactId, noteId);
      setContact(response.data);
    } catch (error) {
      console.error('Failed to delete note:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la note');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {contactId === 'new' ? 'Nouveau contact' : 'Détails du contact'}
          </Text>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prénom *</Text>
            <TextInput
              style={styles.input}
              value={contact.first_name}
              onChangeText={(text) => setContact({ ...contact, first_name: text })}
              placeholder="Prénom"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              value={contact.last_name}
              onChangeText={(text) => setContact({ ...contact, last_name: text })}
              placeholder="Nom"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={contact.email}
              onChangeText={(text) => setContact({ ...contact, email: text })}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={contact.phone}
              onChangeText={(text) => setContact({ ...contact, phone: text })}
              placeholder="+33 6 12 34 56 78"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Entreprise</Text>
            <TextInput
              style={styles.input}
              value={contact.company}
              onChangeText={(text) => setContact({ ...contact, company: text })}
              placeholder="Nom de l'entreprise"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Poste</Text>
            <TextInput
              style={styles.input}
              value={contact.position}
              onChangeText={(text) => setContact({ ...contact, position: text })}
              placeholder="Poste occupé"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Statut</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  contact.status === 'active' && styles.statusButtonActive,
                ]}
                onPress={() => setContact({ ...contact, status: 'active' })}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    contact.status === 'active' && styles.statusButtonTextActive,
                  ]}
                >
                  Actif
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  contact.status === 'inactive' && styles.statusButtonActive,
                ]}
                onPress={() => setContact({ ...contact, status: 'inactive' })}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    contact.status === 'inactive' && styles.statusButtonTextActive,
                  ]}
                >
                  Inactif
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {contactId !== 'new' && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.noteInputContainer}>
              <TextInput
                style={styles.noteInput}
                value={noteContent}
                onChangeText={setNoteContent}
                placeholder="Ajouter une note..."
                multiline
              />
              <TouchableOpacity
                style={[styles.addNoteButton, !noteContent.trim() && styles.addNoteButtonDisabled]}
                onPress={handleAddNote}
                disabled={!noteContent.trim()}
              >
                <Ionicons name="add" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            {contact.notes?.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <Text style={styles.noteContent}>{note.content}</Text>
                <Text style={styles.noteDate}>
                  {new Date(note.created_at).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  style={styles.deleteNoteButton}
                  onPress={() => handleDeleteNote(note.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    ...typography.body2,
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text.primary,
    ...typography.body1,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
  statusButtonTextActive: {
    color: colors.white,
  },
  notesSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 16,
  },
  noteInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  noteInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text.primary,
    ...typography.body1,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addNoteButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  addNoteButtonDisabled: {
    opacity: 0.5,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteContent: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: 8,
  },
  noteDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  deleteNoteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
  },
}); 
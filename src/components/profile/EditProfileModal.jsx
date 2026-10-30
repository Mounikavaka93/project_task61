import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/SocialContext';
import { readFileAsDataURL } from '../../utils/files';
import { wait } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Button, TextAreaField, TextField } from '../ui/Button';
import { Modal } from '../ui/Modal';

export function EditProfileModal({ open, onClose }) {
  const { currentUser, users, updateProfile } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    name: currentUser.name,
    username: currentUser.username,
    bio: currentUser.bio || '',
    location: currentUser.location || '',
    website: currentUser.website || '',
    avatar: currentUser.avatar || '',
    cover: currentUser.cover || '',
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onPhoto(event, key) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Choose a photo');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast('Choose a photo under 3 MB');
      return;
    }
    const url = await readFileAsDataURL(file);
    setField(key, url);
  }

  function validate() {
    const next = {};
    const name = form.name.trim();
    const username = form.username.trim();
    const website = form.website.trim();
    if (name.length < 2) next.name = 'Name must be at least 2 characters';
    else if (name.length > 40) next.name = 'Name must be 40 characters or fewer';
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) next.username = 'Use 3–20 letters, numbers, or underscores';
    else if (users.some((user) => user.id !== currentUser.id && user.username.toLowerCase() === username.toLowerCase())) {
      next.username = 'That username is taken';
    }
    if (form.bio.trim().length > 160) next.bio = 'Bio must be 160 characters or fewer';
    if (form.location.trim().length > 40) next.location = 'Location must be 40 characters or fewer';
    if (website && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}.*$/i.test(website)) next.website = 'Enter a valid website';
    return next;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const username = form.username.trim().toLowerCase();
    setSaving(true);
    await wait(450);
    updateProfile({
      name: form.name.trim(),
      username,
      bio: form.bio.trim(),
      location: form.location.trim(),
      website: form.website.trim(),
      avatar: form.avatar,
      cover: form.cover,
    });
    setSaving(false);
    showToast('Profile updated');
    onClose();
    if (username !== currentUser.username) navigate(`/profile/${username}`, { replace: true });
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit profile" wide>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="flex items-center gap-4">
          <Avatar user={{ ...currentUser, avatar: form.avatar, name: form.name }} size="lg" />
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-xl bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700">
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={(event) => onPhoto(event, 'avatar')} />
            </label>
            {form.avatar && (
              <Button variant="ghost" size="sm" onClick={() => setField('avatar', '')}>
                Remove
              </Button>
            )}
          </div>
        </div>
        <label className="block text-sm font-bold">
          Cover photo
          <input type="file" accept="image/*" className="mt-1.5 block w-full text-sm text-ink-soft" onChange={(event) => onPhoto(event, 'cover')} />
        </label>
        <TextField id="profile-name" label="Name" value={form.name} maxLength={40} error={errors.name} onChange={(event) => setField('name', event.target.value)} />
        <TextField
          id="profile-username"
          label="Username"
          value={form.username}
          maxLength={20}
          error={errors.username}
          autoCapitalize="none"
          spellCheck={false}
          onChange={(event) => setField('username', event.target.value)}
        />
        <TextAreaField
          id="profile-bio"
          label="Bio"
          value={form.bio}
          maxLength={160}
          error={errors.bio}
          hint={`${form.bio.length}/160`}
          onChange={(event) => setField('bio', event.target.value)}
        />
        <TextField id="profile-location" label="Location" value={form.location} maxLength={40} error={errors.location} onChange={(event) => setField('location', event.target.value)} />
        <TextField id="profile-website" label="Website" value={form.website} error={errors.website} onChange={(event) => setField('website', event.target.value)} />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

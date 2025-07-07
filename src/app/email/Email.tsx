import { useEmail } from '../../hooks/useEmail';

export const ContactForm = () => {
  const { sendEmail, isLoading, error } = useEmail();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      // Send contact form email
      await sendEmail({
        to: 'admin@yoursite.com',
        template: 'contactForm',
        templateData: {
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        },
      });

      // Send welcome email to user
      await sendEmail({
        to: formData.get('email') as string,
        template: 'welcome',
        templateData: {
          name: formData.get('name'),
        },
      });

      alert('Emails sent successfully!');
    } catch(error) {
      console.error('Error sending emails:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};
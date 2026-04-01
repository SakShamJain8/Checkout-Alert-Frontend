import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px', flex: 1 }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
                    Terms of Service
                </h1>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '40px' }}>
                    Last updated: March 31, 2026
                </p>

                <Section title="1. Acceptance of terms">
                    By creating an account and using CheckoutAlert, you agree to be bound
                    by these Terms of Service. If you do not agree to these terms, do not
                    use the service. These terms apply to all users of CheckoutAlert.
                </Section>

                <Section title="2. Description of service">
                    CheckoutAlert is an API monitoring service that periodically pings your
                    specified endpoints, detects anomalies, and sends alert notifications.
                    The free tier allows monitoring of up to 5 endpoints. We reserve the
                    right to modify or discontinue the service at any time with reasonable notice.
                </Section>

                <Section title="3. Acceptable use">
                    You agree to use CheckoutAlert only for lawful purposes. You must not
                    use the service to monitor endpoints you do not own or have explicit
                    permission to monitor. You must not attempt to abuse the service through
                    excessive requests, automated account creation, or any activity that
                    disrupts service for other users. Violation of these terms may result
                    in immediate account termination.
                </Section>

                <Section title="4. Account responsibility">
                    You are responsible for maintaining the security of your account
                    credentials. You are responsible for all activity that occurs under
                    your account. Notify us immediately at checkoutalertt@gmail.com if
                    you suspect unauthorized access to your account.
                </Section>

                <Section title="5. Free tier limitations">
                    The free tier is limited to 5 monitored endpoints per account. We
                    reserve the right to change free tier limits with 30 days notice.
                    We may introduce paid tiers in the future with additional features
                    and higher limits.
                </Section>

                <Section title="6. Service availability">
                    We strive to maintain high availability but do not guarantee uninterrupted
                    service. CheckoutAlert is provided on an "as is" basis. We are not liable
                    for any losses arising from service downtime, missed alerts, or incorrect
                    anomaly detection. You should not rely solely on CheckoutAlert for
                    mission-critical monitoring.
                </Section>

                <Section title="7. Data and privacy">
                    Your use of CheckoutAlert is also governed by our Privacy Policy.
                    You retain ownership of your data. By using the service, you grant
                    us the right to store and process your data solely for the purpose
                    of providing the monitoring service.
                </Section>

                <Section title="8. Intellectual property">
                    CheckoutAlert and all its components, including the software, design,
                    and content, are the intellectual property of CheckoutAlert. You may
                    not copy, modify, or distribute any part of the service without
                    explicit written permission.
                </Section>

                <Section title="9. Limitation of liability">
                    To the maximum extent permitted by law, CheckoutAlert shall not be
                    liable for any indirect, incidental, special, or consequential damages
                    arising from your use of the service, including but not limited to
                    loss of revenue, data, or business opportunity.
                </Section>

                <Section title="10. Termination">
                    You may terminate your account at any time by contacting us. We reserve
                    the right to terminate accounts that violate these terms. Upon termination,
                    your data will be deleted within 30 days.
                </Section>

                <Section title="11. Changes to terms">
                    We may update these Terms of Service at any time. We will notify you
                    of significant changes by email. Continued use of the service after
                    changes constitutes acceptance of the updated terms.
                </Section>

                <Section title="12. Contact">
                    For questions about these Terms of Service, contact us at{' '}
                    <a href="mailto:checkoutalertt@gmail.com" style={{ color: '#1a1a1a' }}>
                        checkoutalertt@gmail.com
                    </a>.
                </Section>
            </div>
            <Footer />
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{
                fontSize: '16px', fontWeight: '600',
                color: '#1a1a1a', marginBottom: '10px'
            }}>
                {title}
            </h2>
            <p style={{
                fontSize: '14px', color: '#555',
                lineHeight: '1.8', margin: 0
            }}>
                {children}
            </p>
        </div>
    );
}
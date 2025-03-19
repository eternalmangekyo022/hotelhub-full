import { useEffect } from "react";
import "./styles/pp.scss";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PP,
});

function PP() {
  useEffect(() => {
    document.title = "HotelHub - Privacy Policy";
  }, []);

  return (
    <div className="pp">
      <div>
        <h1>Privacy Policy</h1>
        <span>HotelHub Showcase Website</span>

        <h2>Data Protection and User Privacy</h2>

        <p>
          At HotelHub, we value your privacy and are committed to safeguarding
          your personal information. This Privacy Policy outlines how we
          collect, use, and protect your data when you access and use our
          platform. By using HotelHub, you agree to the terms outlined in this
          policy.
        </p>

        <h2>Information Collection:</h2>
        <p>
          We collect certain personal information, such as your name, email
          address, and location, to enhance your dining experience. This data is
          voluntarily provided by you when you create an account or interact
          with our platform.
        </p>

        <h2>Use of Information:</h2>
        <p>
          The information we collect is used to personalize your dining
          recommendations, improve our services, and keep you informed about the
          latest updates and offers. Rest assured, we will never share or sell
          your personal information to third parties without your consent.
        </p>

        <h2>Cookies and Tracking:</h2>
        <p>
          HotelHub uses cookies to enhance user experience and provide
          personalized content. These cookies may track your browsing behavior
          on our platform. You can manage your cookie preferences through your
          browser settings.
        </p>

        <h2>Data Security:</h2>
        <p>
          We employ industry-standard security measures to protect your data
          from unauthorized access, alteration, or disclosure. However, it is
          essential to understand that no online platform can guarantee 100%
          security, and you use HotelHub at your own risk.
        </p>

        <h2>Third-Party Links:</h2>
        <p>
          HotelHub may contain links to external websites and services. We do
          not have control over the privacy practices of these third-party
          sites. Please review their respective privacy policies before
          providing any personal information.
        </p>

        <h2>Updates and Amendments:</h2>
        <p>
          HotelHub may update this Privacy Policy from time to time to reflect
          changes in data regulations or platform enhancements. We recommend
          checking this page periodically for the latest information.
        </p>

        <p>
          If you have any questions or concerns regarding our Privacy Policy or
          how we handle your data, please feel free to contact our support team
          at privacy@HotelHub.com.
        </p>
      </div>
    </div>
  );
}

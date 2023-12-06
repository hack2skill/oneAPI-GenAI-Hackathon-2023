import cv2
import mediapipe as mp
import tensorflow as tf  # Import Intel Optimized TensorFlow

# Initialize MediaPipe Hand module
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()

# Use 0 for default camera, or specify the camera index
cap = cv2.VideoCapture(0)

# Set the ROI coordinates (adjust these values based on your specific case)
roi_x, roi_y, roi_width, roi_height = 450, 250, 170, 200

while True:
    ret, frame = cap.read()

    # Convert the BGR image to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame and get hand landmarks
    results = hands.process(rgb_frame)

    # Check if hands are detected
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Check if any landmark is within the ROI
            hand_in_roi = all(
                roi_x <= lm.x * frame.shape[1] <= roi_x + roi_width and
                roi_y <= lm.y * frame.shape[0] <= roi_y + roi_height
                for lm in hand_landmarks.landmark
            )

            if hand_in_roi:
                # Draw landmarks on the frame
                mp_drawing = mp.solutions.drawing_utils
                mp_drawing.draw_landmarks(
                    frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                cv2.putText(frame, f"Customer 102 is interacting with the shoe", (
                    10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    cv2.imshow('Hand Detection', frame)

    if cv2.waitKey(30) & 0xFF == 27:  # Press 'Esc' to exit
        break

cap.release()
cv2.destroyAllWindows()






# import cv2
# import mediapipe as mp

# # Initialize MediaPipe Hand module
# mp_hands = mp.solutions.hands
# hands = mp_hands.Hands()

# # Use 0 for default camera, or specify the camera index
# cap = cv2.VideoCapture(0)

# # Set the ROI coordinates (adjust these values based on your specific case)
# roi_x, roi_y, roi_width, roi_height = 450, 250, 170, 200

# while True:
#     ret, frame = cap.read()

#     # Convert the BGR image to RGB
#     rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#     # Process the frame and get hand landmarks
#     results = hands.process(rgb_frame)

#     # Check if hands are detected
#     if results.multi_hand_landmarks:
#         for hand_landmarks in results.multi_hand_landmarks:
#             # Check if any landmark is within the ROI
#             hand_in_roi = all(
#                 roi_x <= lm.x * frame.shape[1] <= roi_x + roi_width and
#                 roi_y <= lm.y * frame.shape[0] <= roi_y + roi_height
#                 for lm in hand_landmarks.landmark
#             )

#             if hand_in_roi:
#                 # Draw landmarks on the frame
#                 mp_drawing = mp.solutions.drawing_utils
#                 mp_drawing.draw_landmarks(
#                     frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

#                 cv2.putText(frame, f"Customer 102 is interacting with the shoe", (
#                     10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

#     # Draw the ROI rectangle on the frame
#     # cv2.rectangle(frame, (roi_x, roi_y), (roi_x + roi_width,
#     #               roi_y + roi_height), (0, 255, 0), 2)
#     # cv2.rectangle(frame, (roi_x-250, roi_y), (roi_x + roi_width,
#     #               roi_y + roi_height), (0, 255, 0), 2)
#     # cv2.rectangle(frame, (roi_x-400, roi_y), (roi_x + roi_width,
#     #               roi_y + roi_height), (0, 255, 0), 2)

#     cv2.imshow('Hand Detection', frame)

#     if cv2.waitKey(30) & 0xFF == 27:  # Press 'Esc' to exit
#         break

# cap.release()
# cv2.destroyAllWindows()

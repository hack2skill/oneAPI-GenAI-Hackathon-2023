import cv2
import dlib
import torch

# Use Intel Optimized TensorFlow
import tensorflow as tf
print(tf.__version__)

# Use Intel Optimized PyTorch
print(torch.__config__.show())


def detect_face_orientation(video_source=0):
    # Rest of your code remains unchanged...
    # (Please note that you need to download the shape_predictor_68_face_landmarks.dat file)

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            print("Error reading frame.")
            break

        # Convert the frame to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in the frame
        faces = face_detector(gray)

        # Check if a face is detected
        if len(faces) > 0:
            # Assume only one face in the frame for simplicity
            face = faces[0]

            # Detect facial landmarks
            landmarks = landmarks_predictor(gray, face)

            # Extract relevant landmarks for orientation estimation
            # Rest of your code remains unchanged...

    # Release the camera and close all OpenCV windows
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    # Initialize the face detector from dlib
    face_detector = dlib.get_frontal_face_detector()
    landmarks_predictor = dlib.shape_predictor(
        "shape_predictor_68_face_landmarks.dat")  # You need to download this file

    # Open a connection to the video source (0 for default camera)
    cap = cv2.VideoCapture(0)

    detect_face_orientation()







# import cv2
# import dlib
 
 
# def detect_face_orientation(video_source=0):
#     # Open a connection to the video source (0 for default camera)
#     cap = cv2.VideoCapture(video_source)
 
#     # Initialize the face detector from dlib
#     face_detector = dlib.get_frontal_face_detector()
#     landmarks_predictor = dlib.shape_predictor(
#         "shape_predictor_68_face_landmarks.dat")  # You need to download this file
 
#     while True:
#         # Capture frame-by-frame
#         ret, frame = cap.read()
#         if not ret:
#             print("Error reading frame.")
#             break
 
#         # Convert the frame to grayscale for face detection
#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
 
#         # Detect faces in the frame
#         faces = face_detector(gray)
 
#         # Check if a face is detected
#         if len(faces) > 0:
#             # Assume only one face in the frame for simplicity
#             face = faces[0]
 
#             # Detect facial landmarks
#             landmarks = landmarks_predictor(gray, face)
 
#             # Extract relevant landmarks for orientation estimation
#             left_eye = (landmarks.part(36).x, landmarks.part(36).y)
#             right_eye = (landmarks.part(45).x, landmarks.part(45).y)
#             nose_tip = (landmarks.part(30).x, landmarks.part(30).y)
 
#             # Calculate the midpoint of the eyes
#             eyes_midpoint = (
#                 (left_eye[0] + right_eye[0]) // 2, (left_eye[1] + right_eye[1]) // 2)
 
#             # Calculate the horizontal distance between the midpoint of the eyes and the nose tip
#             horizontal_distance = abs(nose_tip[0] - eyes_midpoint[0])
 
#             # Set a threshold for the horizontal distance to classify the orientation
#             if horizontal_distance < 10:  # Adjust the threshold as needed
#                 orientation = "Allen solly shirt"
#             elif nose_tip[0] > eyes_midpoint[0]:
#                 orientation = "Bata shoe"
#             else:
#                 orientation = "katespade"
 
#             # Display the result on the frame
#             cv2.putText(frame, f"Customer 102 is looking at {orientation}", (
#                 10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
 
#         # Display the frame
#         cv2.imshow("Face Orientation Analysis", frame)
 
#         # Break the loop if 'q' is pressed
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break
 
#     # Release the camera and close all OpenCV windows
#     cap.release()
#     cv2.destroyAllWindows()
 
 
# if __name__ == "__main__":
#     detect_face_orientation()